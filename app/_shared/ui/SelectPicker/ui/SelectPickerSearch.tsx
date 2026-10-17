import { SearchInput } from '../../SearchInput'

interface Props {
  search?: string
  onSearch?: (search: string) => void
}

export const SelectPickerSearch = ({ search, onSearch }: Props) => {
  return (
    <div className='p-3 border-b border-slate-100'>
      <SearchInput
        value={search}
        onChange={(e) => onSearch?.(e.target.value)}
        className='max-lg:min-h-11'
      />
    </div>
  )
}
