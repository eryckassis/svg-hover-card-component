export type TwinTextProps = {
  text: string

  className?: string

  duration?: number

  ease?: string

  hoverParent?: boolean

  controlled?: boolean
}

export type TwinTextHandle = {
  enter: () => void
  leave: () => void
}
