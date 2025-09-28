import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

 const LoadingSkeleton = () => {
    return (
      <>
        <Skeleton height={32} count={1}></Skeleton>
        <Skeleton style={{ marginTop: '42px' }} height={2} count={1}></Skeleton>
        <SkeletonTheme baseColor="#f4f4f6" highlightColor="#A3A3A3">
          {Array(10)?.fill(10)
            .map((_, index) => (
              <Skeleton key={index} height={36} count={1}></Skeleton>
            ))}
          <div className="flex justify-between">
            <Skeleton width={120} height={36}></Skeleton>
            <Skeleton width={140} height={36}></Skeleton>
          </div>
        </SkeletonTheme>
      </>
    );
  };

  export default LoadingSkeleton;