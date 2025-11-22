import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardFooter, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Typewriter } from '@/components/Typewriter'
import LavenderBackground from '@/components/LavenderBackground'
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 m-4 rounded-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Receipt Generator</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-purple-100">Dashboard</Button>
              </Link>
              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Compact */}
      <section className="relative py-32 flex items-center overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-50 -z-10" />

        <div className="container mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <Typewriter text="Create Professional Receipts" speed={40} />
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block mt-2">Using AI</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                Upload any receipt sample, and our AI will analyze and recreate its layout.
                Then generate unlimited receipts with your own business data.
              </p>
              <div className="flex gap-4">
                <Link href="/auth/login">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                    <Sparkles className="h-5 w-5" />
                    Start Creating
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="glass-card p-6 shadow-2xl w-full max-w-sm">
                {/* Receipt Mockup */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 space-y-4">
                  {/* Header */}
                  <div className="space-y-2 pb-4 border-b border-purple-200">
                    <div className="h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded w-2/3"></div>
                    <div className="h-4 bg-purple-200 rounded w-1/2"></div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 py-4 border-b border-purple-200">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-purple-200 rounded w-1/2"></div>
                      <div className="h-4 bg-purple-300 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-purple-200 rounded w-2/5"></div>
                      <div className="h-4 bg-purple-300 rounded w-1/5"></div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total</span>
                    <div className="h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <GlassCard glow className="text-center">
              <GlassCardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
                <p className="text-gray-600 font-medium">Receipts Created</p>
              </GlassCardContent>
            </GlassCard>

            <GlassCard glow className="text-center">
              <GlassCardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-4xl font-bold text-pink-600 mb-2">500+</div>
                <p className="text-gray-600 font-medium">Active Users</p>
              </GlassCardContent>
            </GlassCard>

            <GlassCard glow className="text-center">
              <GlassCardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                <p className="text-gray-600 font-medium">Uptime</p>
              </GlassCardContent>
            </GlassCard>

            <GlassCard glow className="text-center">
              <GlassCardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-4xl font-bold text-pink-600 mb-2">24/7</div>
                <p className="text-gray-600 font-medium">Support</p>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gradient-to-b from-purple-50/50 via-purple-50/30 to-white/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to create your receipts</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="border-purple-200/50">
              <GlassCardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <GlassCardTitle>1. Upload Sample</GlassCardTitle>
                <GlassCardDescription>
                  Upload any receipt image. Our AI will analyze its layout, fonts, spacing, and structure.
                </GlassCardDescription>
              </GlassCardHeader>
            </GlassCard>

            <GlassCard className="border-purple-200/50">
              <GlassCardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <GlassCardTitle>2. Enter Your Data</GlassCardTitle>
                <GlassCardDescription>
                  Fill in your business details, items, prices, and see a live preview of your receipt.
                </GlassCardDescription>
              </GlassCardHeader>
            </GlassCard>

            <GlassCard className="border-purple-200/50">
              <GlassCardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <GlassCardTitle>3. Download Receipt</GlassCardTitle>
                <GlassCardDescription>
                  Download your professional receipt as PDF or PNG. Print or email it instantly.
                </GlassCardDescription>
              </GlassCardHeader>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-purple-50/40 via-white to-purple-50/30">
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
              <GlassCard key={idx} glow className="border-purple-200/50">
                <GlassCardHeader>
                  <feature.icon className="h-8 w-8 text-purple-600 mb-2" />
                  <GlassCardTitle className="text-lg">{feature.title}</GlassCardTitle>
                  <GlassCardDescription>{feature.description}</GlassCardDescription>
                </GlassCardHeader>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gradient-to-b from-purple-50/40 via-white to-purple-50/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <GlassCard className="border-purple-200/50">
              <GlassCardHeader>
                <GlassCardTitle>Free</GlassCardTitle>
                <GlassCardDescription>Perfect for trying out</GlassCardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-600">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>3 receipts per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>AI layout extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>PDF & PNG export</span>
                  </li>
                </ul>
              </GlassCardContent>
              <GlassCardFooter>
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                    Get Started
                  </Button>
                </Link>
              </GlassCardFooter>
            </GlassCard>

            <GlassCard glow className="relative md:scale-105 border-purple-300/60">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </span>
              </div>
              <GlassCardHeader>
                <GlassCardTitle>Pro Monthly</GlassCardTitle>
                <GlassCardDescription>For regular users</GlassCardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-600">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>Unlimited receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>AI layout extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>PDF & PNG export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </GlassCardContent>
              <GlassCardFooter>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                    Subscribe Now
                  </Button>
                </Link>
              </GlassCardFooter>
            </GlassCard>

            <GlassCard className="border-purple-200/50">
              <GlassCardHeader>
                <GlassCardTitle>Pro Yearly</GlassCardTitle>
                <GlassCardDescription>Save 20% annually</GlassCardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-600">$182</span>
                  <span className="text-gray-600">/year</span>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>Unlimited receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>AI layout extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>PDF & PNG export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-purple-600" />
                    <span>20% discount</span>
                  </li>
                </ul>
              </GlassCardContent>
              <GlassCardFooter>
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                    Subscribe Now
                  </Button>
                </Link>
              </GlassCardFooter>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <GlassCard glow className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-12 text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-gray-700">
              Create your first AI-powered receipt in minutes
            </p>
            <Link href="/auth/login">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                <Sparkles className="h-5 w-5" />
                Start Creating Now
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-purple-950 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-300" />
                <span className="text-lg font-bold">AI Receipt Generator</span>
              </div>
              <p className="text-purple-300">
                Professional receipts powered by AI
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-purple-300 hover:text-white">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-purple-300 hover:text-white">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-purple-300">
                <li>support@aireceipt.com</li>
                <li>Help Center</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-800 mt-8 pt-8 text-center text-purple-300">
            <p>&copy; 2025 AI Receipt Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
