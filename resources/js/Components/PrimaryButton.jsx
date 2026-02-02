export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-brand-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 ease-out hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 focus:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
