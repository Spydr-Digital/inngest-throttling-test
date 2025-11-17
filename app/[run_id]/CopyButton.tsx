'use client'

interface CopyButtonProps<T> {
  data: T
}

export default function CopyButton<T>({ data }: CopyButtonProps<T>) {
  const handleCopy = async () => {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      await navigator.clipboard.writeText(jsonString)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="px-3 py-1.5 text-sm bg-blue-300 hover:bg-blue-600 text-black hover:text-white rounded transition-colors cursor-pointer"
    >
      Copy raw data
    </button>
  )
}
