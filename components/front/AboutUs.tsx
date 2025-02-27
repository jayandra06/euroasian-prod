'use client'

import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const AboutUs = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true })
    }, [])

    return (
        <div className="relative bg-gray-900 text-white overflow-hidden">
            {/* Animated Wave Background */}
            <div className="absolute inset-0 z-0">
                <div className="wave"></div>
                <div className="wave" style={{ animationDelay: '-2s' }}></div>
                <div className="wave" style={{ animationDelay: '-4s' }}></div>
            </div>

            <div className="relative z-10 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" data-aos="fade-down">
                            Pioneering Maritime Excellence
                        </h2>

                        <div className="grid md:grid-cols-2 gap-16">
                            <div className="space-y-12" data-aos="fade-right">
                                <div className="backdrop-blur-md bg-white/5 rounded-lg p-8 border border-cyan-500/10">
                                    <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Our Vision</h3>
                                    <p className="text-gray-300">
                                        To revolutionize the maritime industry through our procurement and managment application and unparalleled service quality, becoming the global benchmark.
                                    </p>
                                </div>

                                <div className="backdrop-blur-md bg-white/5 rounded-lg p-8 border border-cyan-500/10">
                                    <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Our Mission</h3>
                                    <p className="text-gray-300">
                                        Delivering maritime solutions through cutting-edge technology and global expertise, ensuring operational excellence for our partners worldwide.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-8" data-aos="fade-left">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-25"></div>
                                    <div className="relative backdrop-blur-md bg-white/5 rounded-lg p-8 border border-cyan-500/10">
                                        <h3 className="text-2xl font-semibold mb-6 text-cyan-400">Global Presence</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                    <span className="text-cyan-400 font-bold">EU</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">European Headquarters</h4>
                                                    <p className="text-gray-400">Strategic operations center</p>
                                                </div>
                                            </div>
                                            {/* <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                    <span className="text-cyan-400 font-bold">SG</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">Singapore Hub</h4>
                                                    <p className="text-gray-400">Asian-Pacific distribution center</p>
                                                </div>
                                            </div> */}
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                    <span className="text-cyan-400 font-bold">IN</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">India Operations</h4>
                                                    <p className="text-gray-400">Technical support & development</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                       
                    </div>
                </div>
            </div>

            <style jsx>{`
                .wave {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1));
                    opacity: 0.5;
                }

                .wave::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 200%;
                    height: 200%;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
                    animation: wave 8s linear infinite;
                }

                @keyframes wave {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(360deg);
                    }
                }
            `}</style>
        </div>
    )
}

export default AboutUs

