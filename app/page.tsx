import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Upload,
  Sparkles,
  Download,
  Check,
  Zap,
  Shield,
  Palette
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">AI Receipt Generator</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Create Professional Receipts
              <span className="text-blue-600"> Using AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upload any receipt sample, and our AI will analyze and recreate its layout.
              Then generate unlimited receipts with your own business data.
            </p>
            <div className="flex gap-4">
              <Link href="/generator">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Start Creating
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-px bg-gray-300 my-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="h-px bg-gray-300 my-4"></div>
                  <div className="h-6 bg-blue-600 rounded w-1/3 ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to create your receipts</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>1. Upload Sample</CardTitle>
                <CardDescription>
                  Upload any receipt image. Our AI will analyze its layout, fonts, spacing, and structure.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>2. Enter Your Data</CardTitle>
                <CardDescription>
                  Fill in your business details, items, prices, and see a live preview of your receipt.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>3. Download Receipt</CardTitle>
                <CardDescription>
                  Download your professional receipt as PDF or PNG. Print or email it instantly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to create perfect receipts</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'AI Layout Cloning',
                description: 'Advanced AI analyzes and recreates any receipt layout with precision',
              },
              {
                icon: Zap,
                title: 'Instant Generation',
                description: 'Generate receipts in seconds with live preview',
              },
              {
                icon: Palette,
                title: 'Custom Branding',
                description: 'Add your logo and match your brand colors',
              },
              {
                icon: Download,
                title: 'PDF & PNG Export',
                description: 'Download in multiple formats for any use case',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your data is encrypted and securely stored',
              },
              {
                icon: Check,
                title: 'Professional Quality',
                description: 'Print-ready, high-resolution receipts every time',
              },
            ].map((feature, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for trying out</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>3 receipts per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>AI layout extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>PDF & PNG export</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard" className="w-full">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-blue-600 border-2 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle>Pro Monthly</CardTitle>
                <CardDescription>For regular users</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Unlimited receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>AI layout extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>PDF & PNG export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full">
                    Subscribe Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pro Yearly</CardTitle>
                <CardDescription>Save 20% annually</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$182</span>
                  <span className="text-gray-600">/year</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Unlimited receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>AI layout extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>PDF & PNG export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>20% discount</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard" className="w-full">
                  <Button variant="outline" className="w-full">
                    Subscribe Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Create your first AI-powered receipt in minutes
            </p>
            <Link href="/generator">
              <Button size="lg" variant="secondary" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Start Creating Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6" />
                <span className="text-lg font-bold">AI Receipt Generator</span>
              </div>
              <p className="text-gray-400">
                Professional receipts powered by AI
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@aireceipt.com</li>
                <li>Help Center</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Receipt Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
