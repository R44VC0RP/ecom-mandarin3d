'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-[var(--m3d-primary)] dark:bg-black',
        {
          relative: label,
          'border-2 border-[var(--m3d-primary)]': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {props.src ? (
        <Image
          className={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}

export function ShowcaseGridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    position?: 'bottom' | 'center';
  };
} & (React.ComponentProps<typeof Image> | { src: string; isVideo?: boolean; videoStyle?: 'loop' | 'freeze' })) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if ('isVideo' in props && props.videoStyle === 'freeze' && videoRef.current) {
      const video = videoRef.current;
      const handleEnded = () => {
        video.currentTime = video.duration;
      };
      
      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, [props]);

  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-[var(--m3d-primary)] dark:bg-black',
        {
          relative: label,
          'border-2 border-[var(--m3d-primary)]': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {'isVideo' in props ? (
        <video
          ref={videoRef}
          src={props.src}
          className={clsx('relative h-full w-full object-cover', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          autoPlay
          loop={props.videoStyle !== 'freeze'}
          muted
          playsInline
        />
      ) : (
        props.src ? (
          <Image
            className={clsx('relative h-full w-full object-contain', {
              'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
            })}
            {...props as React.ComponentProps<typeof Image>}
          />
        ) : null
      )}
      {label ? (
        <div className={clsx(
          'absolute bottom-4 left-4',
        )}>
          <div className={clsx(
            'inline-flex rounded-lg border border-neutral-200 bg-black/70 px-4 py-2 text-white backdrop-blur-md dark:border-neutral-800',
            {
              'text-xl font-bold': label.position === 'center',
              'text-sm font-medium': label.position === 'bottom'
            }
          )}>
            {label.title}
          </div>
        </div>
      ) : null}
    </div>
  );
}
