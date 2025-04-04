"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function NftFilters() {
  const [priceRange, setPriceRange] = useState([0, 1])

  return (
    <div className="bg-muted/50 p-6 rounded-lg">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>

      <Accordion type="multiple" defaultValue={["price", "collections"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 px-2">
              <Slider defaultValue={[0, 1]} max={1} step={0.01} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex justify-between mt-2">
                <span>{priceRange[0]} MATIC</span>
                <span>{priceRange[1]} MATIC</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="collections">
          <AccordionTrigger>Collections</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {[
                "Data Trends",
                "Momentum Series",
                "Pattern Collection",
                "Activity Series",
                "Trend Series",
                "Mood Collection",
              ].map((collection) => (
                <div key={collection} className="flex items-center space-x-2">
                  <Checkbox id={`collection-${collection}`} />
                  <Label htmlFor={`collection-${collection}`}>{collection}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="themes">
          <AccordionTrigger>Themes</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {["Abstract", "Pixel Art", "Landscape", "Portrait", "Futuristic", "Retro"].map((theme) => (
                <div key={theme} className="flex items-center space-x-2">
                  <Checkbox id={`theme-${theme}`} />
                  <Label htmlFor={`theme-${theme}`}>{theme}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data">
          <AccordionTrigger>Data Source</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {["Price Movements", "Trading Volume", "Social Sentiment", "DeFi Activity"].map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox id={`source-${source}`} />
                  <Label htmlFor={`source-${source}`}>{source}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Reset
        </Button>
      </div>
    </div>
  )
}

