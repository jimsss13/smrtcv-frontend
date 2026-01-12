import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Configuration for button style variants using class-variance-authority.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90', 
        destructive: 'bg-red-500 text-white hover:bg-red-500/75 hover:scale-110  transition-all',
        outline: 'border border-border bg-transparent hover:bg-background-light text-foreground',
        secondary: 'bg-blue-500 text-white hover:bg-blue-500/75 hover:scale-110  transition-all',
        ghost: 'hover:bg-background-light text-foreground-secondary',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Properties for the Button component.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Whether to render the button as a child element using Radix UI Slot. */
  asChild?: boolean;
}

/**
 * A highly customizable button component with multiple variants and sizes.
 * Built with Radix UI Slot for flexibility and class-variance-authority for styling.
 * 
 * @example
 * <Button variant="primary" size="lg">Click Me</Button>
 * 
 * @param props - Component properties including variant, size, and standard button attributes.
 * @param ref - React ref for the underlying button element.
 */
const Button = React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
));
Button.displayName = 'Button';

export { Button, buttonVariants };