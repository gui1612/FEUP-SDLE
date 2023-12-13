type IteratorProps<TEntry> = {
    iterable: Iterable<TEntry>,
    render: (entry: TEntry, index: number) => JSX.Element,
}

export function ForIterator<TEntry>({iterable, render}: IteratorProps<TEntry>) {
    const children: JSX.Element[] = [];

    let index = 0;
    for (const entry of iterable) {
        children.push(render(entry, index));
        index++;
    }

    return (
        <>
            {children}
        </>
    )
}