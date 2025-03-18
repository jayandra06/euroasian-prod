'use client';

import React from 'react';

export function BuyersCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-white">
            <h2 className="text-4xl font-extrabold text-white mb-4">Solving the No-Part-Number Challenge</h2>
            <p className="text-lg text-gray-300">
              Not all spare parts come with part numbers, and we’ve developed an automated system to address this challenge:
            </p>
            <ul className="space-y-4 text-gray-200">
              <li>
                <strong className="font-semibold">Advanced Identification:</strong>  
                Our platform uses descriptive inputs, images, and equipment details to accurately identify spare parts without part numbers.
              </li>
              <li>
                <strong className="font-semibold">Automated Matching:</strong>  
                Leveraging AI, our system cross-references the provided data with our database to match parts with their respective equipment and vendors.
              </li>
              <li>
                <strong className="font-semibold">Seamless Integration:</strong>  
                This automation ensures that even unnumbered parts are sorted, cataloged, and linked to vendors for quick procurement.
              </li>
            </ul>
            <p className="text-gray-300 font-semibold">
              With this innovation, we eliminate guesswork and ensure every part—numbered or not—is efficiently processed and made available to ship managers.
            </p>
          </div>

          {/* Right Content */}
          <div className="space-y-6 text-white">
            <h2 className="text-4xl font-extrabold text-white mb-4">Customized Spare Manufacturing</h2>
            <p className="text-lg text-gray-300">
              At Euroasiann, we understand that certain spares may require special manufacturing to meet unique vessel needs. For these scenarios, we provide tailored solutions using advanced technology:
            </p>
            <ul className="space-y-4 text-gray-200">
              <li>
                <strong className="font-semibold">Precision Engineering:</strong>  
                Our CNC machines ensure the highest precision in creating metal parts tailored to specific equipment.
              </li>
              <li>
                <strong className="font-semibold">3D Printing Technology:</strong>  
                We utilize state-of-the-art steel and plastic industrial 3D printers to rapidly produce custom spares, ensuring durability and accuracy.
              </li>
              <li>
                <strong className="font-semibold">End-to-End Solutions:</strong>  
                From design and prototyping to final production, we manage the entire process to deliver the perfect fit for your equipment.
              </li>
            </ul>
            <p className="text-gray-300 font-semibold">
              With our custom manufacturing capability, you’ll never face downtime due to unavailable spares. We guarantee timely solutions, maintaining the operational integrity of your vessels.
            </p>
          </div>
        </div>

        {/* Merged Statement */}
        <div className="text-center mt-12">
          <p className="text-xl text-blue-400 font-semibold">
            Euroasiann transforms challenges into seamless solutions by bridging innovation with practicality to keep your vessels operational, ensuring timely procurement and custom-manufactured spares—numbered or not.
          </p>
        </div>
      </div>
    </section>
  );
}

