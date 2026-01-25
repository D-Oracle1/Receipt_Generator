'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useReceiptStore } from '@/lib/store/useReceiptStore'
import { useToast } from '@/components/ui/use-toast'
import { Upload, Plus, Trash2, Download, ArrowLeft, Loader2, Palette } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { LogoUpload } from '@/components/LogoUpload'
import { SignatureUpload } from '@/components/SignatureUpload'
import { getSupabase } from '@/lib/supabase/client'

// Compress image to reduce file size for upload
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      let { width, height } = img

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not compress image'))
            return
          }
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => reject(new Error('Could not load image'))
    img.src = URL.createObjectURL(file)
  })
}

export default function GeneratorPage() {
  const {
    layout,
    setLayout,
    businessInfo,
    setBusinessInfo,
    items,
    addItem,
    updateItem,
    removeItem,
    taxRate,
    setTaxRate,
    discount,
    setDiscount,
    receiptNumber,
    setReceiptNumber,
    notes,
    setNotes,
    subtotal,
    tax,
    total,
    calculateTotals,
    getReceiptData,
    logoUrl,
    setLogoUrl,
  } = useReceiptStore()

  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0 })
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState('#000000')
  const [secondaryColor, setSecondaryColor] = useState('#666666')
  const [currentDate, setCurrentDate] = useState('')
  const { toast } = useToast()

  // Set date on client to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString())
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)

    try {
      // Compress image before uploading to avoid 413 error
      const compressedFile = await compressImage(file, 1200, 0.7)

      const formData = new FormData()
      formData.append('file', compressedFile)

      let response = await fetch('/api/extract-layout', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      // Handle 401 by refreshing session and retrying
      if (response.status === 401) {
        await getSupabase().auth.refreshSession()
        response = await fetch('/api/extract-layout', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })
      }

      if (response.ok) {
        const { layout: extractedLayout } = await response.json()
        setLayout(extractedLayout)
        toast({
          title: 'Layout extracted',
          description: 'Your receipt layout has been analyzed successfully',
        })
      } else {
        const { error } = await response.json()
        toast({
          title: 'Error',
          description: error || 'Failed to extract layout',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }, [setLayout, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  })

  const handleAddItem = () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.price <= 0) {
      toast({
        title: 'Invalid item',
        description: 'Please fill in all item fields with valid values',
        variant: 'destructive',
      })
      return
    }

    const total = newItem.quantity * newItem.price
    addItem({ ...newItem, total })
    setNewItem({ name: '', quantity: 1, price: 0 })
  }

  useEffect(() => {
    calculateTotals()
  }, [items, taxRate, discount, calculateTotals])

  const handleGenerate = async () => {
    if (!businessInfo.name || items.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please add business name and at least one item',
        variant: 'destructive',
      })
      return
    }

    setGenerating(true)

    const requestBody = JSON.stringify({
      layout,
      businessInfo: {
        ...businessInfo,
        logoUrl: logoUrl || undefined,
      },
      items,
      subtotal,
      tax,
      total,
      receiptNumber,
      notes,
      signatureUrl,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
      },
    })

    try {
      let response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: requestBody,
      })

      // Handle 401 by refreshing session and retrying
      if (response.status === 401) {
        await getSupabase().auth.refreshSession()
        response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: requestBody,
        })
      }

      if (response.ok) {
        const { pdfUrl, pngUrl, remainingCredits } = await response.json()
        toast({
          title: 'Receipt generated',
          description: `Your receipt is ready! ${remainingCredits} credits remaining`,
        })

        // Open PDF in new tab
        window.open(pdfUrl, '_blank')
      } else {
        const { error } = await response.json()
        toast({
          title: 'Error',
          description: error || 'Failed to generate receipt',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate receipt',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Generate Receipt
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Sample Receipt</CardTitle>
                <CardDescription>
                  Upload a sample receipt to extract its layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {uploading ? (
                    <p className="text-gray-600">Analyzing layout...</p>
                  ) : isDragActive ? (
                    <p className="text-blue-600">Drop the file here</p>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">
                        Drag & drop a receipt image, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="customize">Customize</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="business">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={businessInfo.name}
                        onChange={(e) => setBusinessInfo({ name: e.target.value })}
                        placeholder="Acme Corporation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessAddress">Address</Label>
                      <Input
                        id="businessAddress"
                        value={businessInfo.address}
                        onChange={(e) =>
                          setBusinessInfo({ address: e.target.value })
                        }
                        placeholder="123 Main St, City, State 12345"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessPhone">Phone</Label>
                      <Input
                        id="businessPhone"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({ phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessEmail">Email</Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo({ email: e.target.value })}
                        placeholder="contact@acme.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items">
                <Card>
                  <CardHeader>
                    <CardTitle>Items</CardTitle>
                    <CardDescription>Add items to your receipt</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} × ${item.price.toFixed(2)} = $
                              {item.total.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div>
                        <Label htmlFor="itemName">Item Name</Label>
                        <Input
                          id="itemName"
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem({ ...newItem, name: e.target.value })
                          }
                          placeholder="Product name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="itemQuantity">Quantity</Label>
                          <Input
                            id="itemQuantity"
                            type="number"
                            min="1"
                            value={newItem.quantity}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                quantity: parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="itemPrice">Price</Label>
                          <Input
                            id="itemPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newItem.price}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddItem} className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customize">
                <Card>
                  <CardHeader>
                    <CardTitle>Customize Receipt</CardTitle>
                    <CardDescription>Add your logo, signature, and customize colors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo Upload */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">Company Logo</Label>
                      <LogoUpload
                        currentLogoUrl={logoUrl}
                        onLogoChange={setLogoUrl}
                      />
                    </div>

                    {/* Signature Upload */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">Signature</Label>
                      <SignatureUpload
                        currentSignatureUrl={signatureUrl}
                        onSignatureChange={setSignatureUrl}
                      />
                    </div>

                    {/* Color Settings */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium block">Colors</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="primaryColor" className="text-sm text-gray-600">Primary Color</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              id="primaryColor"
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="w-10 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="flex-1"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="secondaryColor" className="text-sm text-gray-600">Secondary Color</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              id="secondaryColor"
                              value={secondaryColor}
                              onChange={(e) => setSecondaryColor(e.target.value)}
                              className="w-10 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={secondaryColor}
                              onChange={(e) => setSecondaryColor(e.target.value)}
                              className="flex-1"
                              placeholder="#666666"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Receipt Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="receiptNumber">Receipt Number</Label>
                      <Input
                        id="receiptNumber"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        placeholder="REC-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) =>
                          setTaxRate(parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={discount}
                        onChange={(e) =>
                          setDiscount(parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional notes..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  Your receipt will look like this
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-8 shadow-sm max-w-sm mx-auto" style={{ color: primaryColor }}>
                  {/* Header */}
                  <div className="text-center mb-6">
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-16 object-contain mx-auto mb-3"
                      />
                    )}
                    <h2 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
                      {businessInfo.name || 'Business Name'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {businessInfo.address || 'Business Address'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {businessInfo.phone || 'Phone Number'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {businessInfo.email || 'Email Address'}
                    </p>
                  </div>

                  {/* Receipt Info */}
                  <div className="border-t border-b border-dashed py-3 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span>Receipt #:</span>
                      <span>{receiptNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{currentDate || 'Loading...'}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Item</th>
                          <th className="text-center">Qty</th>
                          <th className="text-right">Price</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-400">
                              No items added yet
                            </td>
                          </tr>
                        ) : (
                          items.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{item.name}</td>
                              <td className="text-center">{item.quantity}</td>
                              <td className="text-right">${item.price.toFixed(2)}</td>
                              <td className="text-right">${item.total.toFixed(2)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%):</span>
                        <span>-${((subtotal * discount) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax ({taxRate}%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t pt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  {notes && (
                    <div className="mt-6 text-xs text-center" style={{ color: secondaryColor }}>
                      {notes}
                    </div>
                  )}
                  {signatureUrl && (
                    <div className="mt-4 flex justify-end">
                      <img
                        src={signatureUrl}
                        alt="Signature"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                  <div className="mt-6 text-center text-sm border-t pt-4" style={{ color: secondaryColor }}>
                    Thank you for your business!
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
