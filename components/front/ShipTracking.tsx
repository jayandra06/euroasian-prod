"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Ship } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

const ShipTracking = () => {
    const [imagesLoaded, setimagesLoaded] = useState("false")
  return (
    <div>
        <section className="py-20 bg-gradient-to-b from-background to-slate-50/20 dark:from-background dark:to-slate-900/20">
          <div className="container">
            <div className="text-center mb-12 animate-on-scroll opacity-0 transition-all duration-700">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Experience Our Technology</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                See how our platform provides real-time visibility into your maritime operations.
              </p>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-xl border animate-on-scroll opacity-0 transition-all duration-700">
              {imagesLoaded ? (
                <>
                  <div className="absolute inset-0 bg-[url('/maritime-map.webp')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

                  {/* Static elements instead of animated for better performance */}
                  <div className="absolute top-1/4 left-1/3">
                    <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-500/20 animate-ping"></div>
                  </div>
                  <div className="absolute top-1/2 left-2/3">
                    <div
                      className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/20 animate-ping"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                  <div className="absolute top-3/4 left-1/4">
                    <div
                      className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-500/20 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>

                  {/* Ship icons with CSS animations instead of JS */}
                  <div className="absolute h-8 w-8 left-[20%] top-[30%] animate-[moveShip_15s_ease-in-out_infinite]">
                    <Ship className="h-8 w-8 text-primary rotate-45" />
                  </div>
                  <div
                    className="absolute h-8 w-8 left-[60%] top-[60%] animate-[moveShip_20s_ease-in-out_infinite_reverse]"
                    style={{ animationDelay: "2s" }}
                  >
                    <Ship className="h-8 w-8 text-primary -rotate-45" />
                  </div>

                  {/* Control panel overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md p-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Live Fleet Monitoring</h3>
                        <p className="text-sm text-muted-foreground">3 vessels currently active</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Filter View
                        </Button>
                        <Button size="sm">Details</Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
          </div>
        </section>

    </div>
  )
}

export default ShipTracking