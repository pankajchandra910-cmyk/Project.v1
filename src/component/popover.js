"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover"; // Corrected import

import { cn } from "./utils"; // Assuming cn is a utility for class concatenation

/**
 * @typedef {object} PopoverProps
 * @property {any} [props] - All other props supported by @radix-ui/react-popover's PopoverPrimitive.Root component
 */

/**
 * A basic Popover component using Radix UI's PopoverPrimitive.Root.
 * @param {PopoverProps} props
 */
function Popover(props) {
  return React.createElement(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}

/**
 * @typedef {object} PopoverTriggerProps
 * @property {any} [props] - All other props supported by @radix-ui/react-popover's PopoverPrimitive.Trigger component
 */

/**
 * A trigger component for the Popover.
 * @param {PopoverTriggerProps} props
 */
function PopoverTrigger(props) {
  return React.createElement(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}

/**
 * @typedef {object} PopoverContentProps
 * @property {string} [className]
 * @property {'start' | 'center' | 'end'} [align='center']
 * @property {number} [sideOffset=4]
 * @property {any} [props] - All other props supported by @radix-ui/react-popover's PopoverPrimitive.Content component
 */

/**
 * The content area of the Popover.
 * @param {PopoverContentProps} props
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return (
    React.createElement(PopoverPrimitive.Portal, null,
      React.createElement(PopoverPrimitive.Content, {
        "data-slot": "popover-content",
        align: align,
        sideOffset: sideOffset,
        className: cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-hidden",
          className,
        ),
        ...props
      })
    )
  );
}

/**
 * @typedef {object} PopoverAnchorProps
 * @property {any} [props] - All other props supported by @radix-ui/react-popover's PopoverPrimitive.Anchor component
 */

/**
 * An anchor component for the Popover.
 * @param {PopoverAnchorProps} props
 */
function PopoverAnchor(props) {
  return React.createElement(PopoverPrimitive.Anchor, { "data-slot": "popover-anchor", ...props });
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };