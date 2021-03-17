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
}

interface Ref {
  isTouch: boolean;
  startPos: number;
  prevTranslate: number;
  innerWidth: number;
}

const disableScroll = (): void => {
  const body: HTMLElement = document.body;
  body.style.height = '100%';
  body.style.overflow = 'hidden';
};

const enableScroll = (): void => {
  const body: HTMLElement = document.body;
  body.style.height = 'auto';
  body.style.overflow = 'auto';
};

const index = (props: Props) => {
  const { children, overscrollTransition = 'all 0.2s ease' } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<Ref>({
    isTouch: false,
    startPos: 0,
    prevTranslate: 0,
    innerWidth: window.innerWidth,
  });
  const [translate, setTranslate] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<Boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth != ref.current.innerWidth) {
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
    if (isDragging && ref.current.isTouch) {
      disableScroll();
    } else {
      enableScroll();
    }
  }, [isDragging]);

  const getPositionX = (e: any): number =>
    e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

  const touchStart = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ): void => {
    if (
      containerRef.current &&
      containerRef.current.scrollWidth - containerRef.current.offsetWidth !== 0
    ) {
      setIsDragging(true);
      containerRef.current.style.transition = 'all 0s';
      ref.current.startPos = getPositionX(e);
    }
  };

  const touchMove = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ): void => {
    if (isDragging) {
      const currentPosition = getPositionX(e);
      setTranslate(
        ref.current.prevTranslate + currentPosition - ref.current.startPos
      );
    }
  };

  const touchEnd = (): void => {
    if (containerRef.current && isDragging) {
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
      }
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          transform: `translateX(${translate}px)`,
        }}
        onTouchStart={(e) => {
          ref.current.isTouch = true;
          touchStart(e);
        }}
        onMouseDown={(e) => {
          ref.current.isTouch = false;
          touchStart(e);
        }}
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
    </div>
  );
};

export default index;
