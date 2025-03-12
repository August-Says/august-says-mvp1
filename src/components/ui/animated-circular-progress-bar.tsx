
"use client"

import * as React from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedCircularProgressBarProps {
  value: number
  min: number
  max: number
  gaugePrimaryColor?: string
  gaugeSecondaryColor?: string
  size?: number
  strokeWidth?: number
  showValue?: boolean
  valueSize?: number
  valueFontWeight?: number
  valueColor?: string
}

export function AnimatedCircularProgressBar({
  value,
  min,
  max,
  gaugePrimaryColor = "rgb(79 70 229)",
  gaugeSecondaryColor = "rgba(0, 0, 0, 0.1)",
  size = 100,
  strokeWidth = 10,
  showValue = false,
  valueSize = 24,
  valueFontWeight = 500,
  valueColor = "#000",
}: AnimatedCircularProgressBarProps) {
  const actualValue = React.useMemo(() => {
    if (value < min) return min
    if (value > max) return max
    return value
  }, [value, min, max])

  const mappedValue = React.useMemo(
    () => ((actualValue - min) / (max - min)) * 100,
    [actualValue, min, max]
  )

  // Use spring animation for smooth transitions
  const springValue = useSpring(mappedValue, {
    stiffness: 100,
    damping: 20,
    mass: 1,
  })

  const transformedValue = useTransform(
    springValue,
    [0, 100],
    [0, 1]
  )

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const circleStyle = {
    strokeDasharray: `${circumference} ${circumference}`,
  }

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={gaugeSecondaryColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={gaugePrimaryColor}
          strokeWidth={strokeWidth}
          style={{
            ...circleStyle,
            strokeDashoffset: useTransform(
              transformedValue,
              (value) => circumference - value * circumference
            ),
          }}
          strokeLinecap="round"
        />
      </svg>
      {showValue && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: valueSize,
            fontWeight: valueFontWeight,
            color: valueColor,
          }}
        >
          <motion.div>{Math.round(actualValue)}</motion.div>
        </div>
      )}
    </div>
  )
}
