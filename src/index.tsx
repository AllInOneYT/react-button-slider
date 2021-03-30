import React, {
  useState,
  useRef,
  useEffect,
  MouseEvent,
  TouchEvent,
} from 'react';

interface Props {
  children: any;
  overscrollTransition?: string;
  dragAcceleration: number;
}

interface Ref {
  isTouch: boolean;
  startPos: number;
  prevTranslate: number;
  innerWidth: number;
  velX: number;
}

const disableScroll = (): void => {
  const { body } = document;
  body.style.height = '100%';
  body.style.overflow = 'hidden';
};

const enableScroll = (): void => {
  const { body } = document;
  body.style.height = 'auto';
  body.style.overflow = 'auto';
};

const getPositionX = (e: any): number =>
  e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

const usePrevious = (n: number): number => {
  const ref = useRef<{ last: number }>({ last: 0 });
  useEffect(() => {
    if (ref.current) {
      ref.current.last = n;
    }
  }, [n]);
  return ref.current.last;
};

const Index = ({
  children,
  overscrollTransition = 'all .3s cubic-bezier(.25,.8,.5,1)',
  dragAcceleration = 1,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<Ref>({
    isTouch: false,
    startPos: 0,
    prevTranslate: 0,
    innerWidth: window.innerWidth,
    velX: 0,
  });
  const [translate, setTranslate] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<Boolean>(false);
  const lastTranslate: number = usePrevious(translate);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth !== ref.current.innerWidth) {
        setTranslate(0);
        ref.current.prevTranslate = 0;
        ref.current.innerWidth = window.innerWidth;
      }
    };

    window.addEventListener('resize', handleResize);

    return (): void => {
      enableScroll();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const vel: number = ref.current.velX;

    if (Math.abs(vel) > 0.5) {
      if (containerRef.current) {
        containerRef.current.style.transition =
          'all .3s cubic-bezier(.25,.8,.5,1)';
      }
      if (Math.abs(vel) > 20) {
        if (vel > 0) {
          ref.current.velX = 20;
        } else {
          ref.current.velX = -20;
        }
      } else {
        ref.current.velX *= 0.9;
      }
      setTranslate((prev) => prev + vel);
      touchEnd(true);
    }
  }, [ref.current.velX]);

  useEffect(() => {
    if (isDragging && ref.current.isTouch) {
      disableScroll();
    } else {
      enableScroll();
    }
  }, [isDragging]);

  const touchStart = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ): void => {
    if (
      containerRef.current &&
      containerRef.current.scrollWidth - containerRef.current.offsetWidth !== 0
    ) {
      setIsDragging(true);
      containerRef.current.style.transition = 'none 0s ease 0s';
      ref.current.startPos = getPositionX(e);
    }
  };

  const touchMove = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ): void => {
    if (isDragging) {
      const currentPosition = getPositionX(e);
      setTranslate(
        ref.current.prevTranslate +
          (currentPosition - ref.current.startPos) * dragAcceleration
      );
    }
  };

  const touchEnd = (boosted: boolean = false): void => {
    if (containerRef.current && (isDragging || boosted)) {
      setIsDragging(false);

      const maxTranslate =
        (containerRef.current.scrollWidth - containerRef.current.offsetWidth) *
        -1;

      if (translate > 0 || maxTranslate === 0) {
        containerRef.current.style.transition = overscrollTransition;
        setTranslate(0);
        ref.current.prevTranslate = 0;
      } else if (translate < maxTranslate) {
        containerRef.current.style.transition = overscrollTransition;
        setTranslate(maxTranslate);
        ref.current.prevTranslate = maxTranslate;
      } else {
        ref.current.prevTranslate = translate;
        if (!boosted) {
          ref.current.velX = translate - lastTranslate;
        }
      }
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      {
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          style={{
            height: '100%',
            display: 'flex',
            transform: `translate3d(${translate}px, 0, 0)`,
          }}
          onTouchStart={(e) => {
            ref.current.isTouch = true;
            touchStart(e);
          }}
          onMouseDown={(e) => {
            ref.current.isTouch = false;
            touchStart(e);
          }}
          onTouchEnd={() => touchEnd()}
          onMouseUp={() => touchEnd()}
          onMouseLeave={() => touchEnd()}
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
