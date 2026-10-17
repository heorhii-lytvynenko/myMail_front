import { Button } from '../../Button'

interface Props {
  onReset: () => void
  onApply: () => void
}

export const SelectPickerActions = ({ onReset, onApply }: Props) => {
  return (
    <div
      className={`
        flex items-center gap-2 justify-between p-3 border-t border-slate-100
        bg-slate-50/50
      `}
    >
      <Button
        className={`
          text-slate-500
          hover:text-slate-900
          max-lg:w-full max-lg:min-h-11
        `}
        onClick={onReset}
        variant='ghost'
        size='s'
      >
        Reset
      </Button>

      <Button
        className='max-lg:w-full max-lg:min-h-11'
        onClick={onApply}
        size='s'
      >
        Apply
      </Button>
    </div>
  )
}
