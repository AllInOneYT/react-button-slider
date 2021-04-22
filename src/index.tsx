import React, { useRef, useEffect, MouseEvent, TouchEvent } from 'react';

interface Props {
  children: any;
  overscrollTransition?: string;
  dragAcceleration?: number;
}

interface Ref {
  isDragging: boolean;
  shouldTransformX: boolean;
  isStartDragging: boolean;
  startPos: number;
  startPosY: number;
  translate: number;
  lastTranslate: number;
  prevTranslate: number;
  innerWidth: number;
  velX: number;
  stopAnimation: boolean;
  maxTranslate: number;
}

const disableScrollY = (): void => {
  document.documentElement.style.overflowY = 'hidden';
};

const enableScrollY = (): void => {
  // @ts-ignore: empty the style of html tag
  document.documentElement.style = '';
};

const getPositionX = (e: any): number =>
  e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

const getPositionY = (e: any): number =>
  e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;

const Index = ({
  children,
  overscrollTransition = 'transform .3s cubic-bezier(.25,.8,.5,1)',
  dragAcceleration = 1,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<Ref>({
    isDragging: false,
    shouldTransformX: false,
    isStartDragging: false,
    startPos: 0,
    startPosY: 0,
    translate: 0,
    lastTranslate: 0,
    prevTranslate: 0,
    innerWidth: window.innerWidth,
    velX: 0,
    stopAnimation: true,
    maxTranslate: 0,
  });

  const getContainer = (): HTMLDivElement => {
    return containerRef.current as HTMLDivElement;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth !== ref.current.innerWidth) {
        enableScrollY();
        ref.current.translate = 0;
        const container = getContainer();
        container.style.transform = `translateX(0)`;
        ref.current.prevTranslate = 0;
        ref.current.innerWidth = window.innerWidth;
      }
    };

    window.addEventListener('resize', handleResize);

    return (): void => {
      enableScrollY();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const touchStart = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ): void => {
    ref.current.stopAnimation = true;

    const container: HTMLDivElement = getContainer();
    if (container.scrollWidth - container.offsetWidth !== 0) {
      ref.current.isDragging = true;
      ref.current.isStartDragging = true;
      container.style.transition = 'none 0s ease 0s';
      ref.current.startPos = getPositionX(e);
      ref.current.startPosY = getPositionY(e);
    }
  };

  const touchMove = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ): void => {
    if (ref.current.isDragging) {
      const currentPosition: number = getPositionX(e);

      if (ref.current.isStartDragging) {
        const currentPositionY: number = getPositionY(e);
        if (Math.abs(currentPositionY - ref.current.startPosY) > 10) {
          ref.current.shouldTransformX = false;
          ref.current.isStartDragging = false;
        } else if (Math.abs(currentPosition - ref.current.startPos) > 10) {
          disableScrollY();
          ref.current.shouldTransformX = true;
          ref.current.isStartDragging = false;
        }
      }

      if (ref.current.shouldTransformX) {
        const container: HTMLDivElement = getContainer();
        const translate: number =
          ref.current.prevTranslate +
          (currentPosition - ref.current.startPos) * dragAcceleration;
        ref.current.lastTranslate = ref.current.translate;
        ref.current.translate = translate;
        container.style.transform = `translateX(${translate}px)`;
      }
    }
  };

  const touchEnd = (): void => {
    enableScrollY();
    const container: HTMLDivElement = getContainer();
    ref.current.shouldTransformX = false;
    if (ref.current.isDragging) {
      ref.current.isDragging = false;
      ref.current.maxTranslate =
        (container.scrollWidth - container.offsetWidth) * -1;
      if (ref.current.translate > 0 || ref.current.maxTranslate === 0) {
        container.style.transition = overscrollTransition;

        ref.current.lastTranslate = 0;
        ref.current.translate = 0;
        container.style.transform = `translateX(0)`;

        ref.current.prevTranslate = 0;
      } else if (ref.current.translate < ref.current.maxTranslate) {
        container.style.transition = overscrollTransition;

        ref.current.lastTranslate = 0;
        ref.current.translate = ref.current.maxTranslate;
        container.style.transform = `translateX(${ref.current.maxTranslate}px)`;

        ref.current.prevTranslate = ref.current.maxTranslate;
      } else {
        ref.current.prevTranslate = ref.current.translate;

        const vel: number = ref.current.translate - ref.current.lastTranslate;

        if (Math.abs(vel) > 0.5) {
          container.style.transition = 'none 0s ease 0s';
          ref.current.velX = vel;
          ref.current.stopAnimation = false;

          requestAnimationFrame(function animate() {
            if (ref.current.stopAnimation) {
              return;
            }

            const translate: number = ref.current.translate + ref.current.velX;

            if (translate > 0) {
              ref.current.lastTranslate = 0;
              ref.current.translate = 0;
              container.style.transform = `translateX(0)`;
              ref.current.prevTranslate = 0;
            } else if (translate < ref.current.maxTranslate) {
              ref.current.lastTranslate = ref.current.maxTranslate;
              ref.current.translate = ref.current.maxTranslate;
              container.style.transform = `translateX(${ref.current.maxTranslate}px)`;
              ref.current.prevTranslate = ref.current.maxTranslate;
            } else {
              ref.current.lastTranslate = ref.current.translate;
              ref.current.translate = translate;
              ref.current.prevTranslate = ref.current.translate;
              container.style.transform = `translateX(${translate}px)`;

              ref.current.velX *= 0.95;
              if (Math.abs(ref.current.velX) > 0.5) {
                requestAnimationFrame(animate);
              }
            }
          });
        }
      }
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      {
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          style={{ display: 'flex' }}
          onTouchStart={touchStart}
          onMouseDown={touchStart}
          onTouchEnd={touchEnd}
          onMouseUp={touchEnd}
          onMouseLeave={touchEnd}
          onTouchMove={touchMove}
          onMouseMove={touchMove}
          onDragStart={(e) => e.preventDefault()}
          ref={containerRef}
        >
          {children}
        </div>
      }
    </div>
  );
};

export default Index;
