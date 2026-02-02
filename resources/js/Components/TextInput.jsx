import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-headline-light dark:text-headline-dark shadow-sm focus:border-brand-500 focus:ring-brand-500 hover:border-brand-300 transition-colors duration-200 ' +
                className
            }
            ref={localRef}
        />
    );
});
