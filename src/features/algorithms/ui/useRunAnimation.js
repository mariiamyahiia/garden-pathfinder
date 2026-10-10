import { usePlaybackStore } from '../../../store/playbackStore'
import { useAnimationLoop } from './useAnimationLoop'
import { ANIMATION_STEPS_PER_SECOND } from '../config'

export function useRunAnimation() {
  const isPlaying = usePlaybackStore((state) => state.isPlaying)
  const advance = usePlaybackStore((state) => state.advance)

  useAnimationLoop({
    active: isPlaying,
    stepsPerSecond: ANIMATION_STEPS_PER_SECOND,
    onAdvance: advance,
  })
}