'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from './ui/button';
import LoadingDots from './placeholder/LoadingDots';

export function SubmitButton({ ...props }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending || props.disabled} {...props}>
      {pending ? <LoadingDots color='#fff' /> : props.children ?? 'Gönder'}
    </Button>
  );
}
