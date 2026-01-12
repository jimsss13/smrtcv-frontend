'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The root Accordion component that manages the expanded/collapsed state of its items.
 * Built on top of Radix UI Accordion primitive.
 * 
 * @example
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">...</AccordionItem>
 * </Accordion>
 */
const Accordion = React.memo(AccordionPrimitive.Root);
Accordion.displayName = 'Accordion';

/**
 * An individual collapsible item within an Accordion.
 * Must be wrapped in an Accordion component.
 * 
 * @param props - Item properties including value and optional className.
 * @param ref - React ref for the underlying item element.
 */
const AccordionItem = React.memo(React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-border', className)}
    {...props}
  />
)));
AccordionItem.displayName = 'AccordionItem';

/**
 * The interactive trigger that toggles the expansion of an AccordionItem.
 * Displays a title and a chevron icon that rotates when expanded.
 * 
 * @param props - Trigger properties including children (title) and optional className.
 * @param ref - React ref for the underlying trigger element.
 */
const AccordionTrigger = React.memo(React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-semibold text-foreground transition-all hover:text-foreground-secondary [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * The content area of an AccordionItem that is revealed when the trigger is clicked.
 * Handles the expansion/collapse animation.
 * 
 * @param props - Content properties including children and optional className.
 * @param ref - React ref for the underlying content element.
 */
const AccordionContent = React.memo(React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm text-foreground-secondary transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
)));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };