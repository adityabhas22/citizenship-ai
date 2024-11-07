'use client';

interface Props {
    schemes: string | null;
}

export default function SchemeResults({ schemes }: Props) {
    if (!schemes) {
        return <div className="p-4">No schemes found.</div>;
    }

    try {
        return (
            <div className="p-4">
                <h2>Matching Schemes:</h2>
                <div>
                    {typeof schemes === 'string' ? (
                        <pre>{schemes}</pre>
                    ) : (
                        <p>Error: Unexpected format for scheme data received. Please try again or contact support.</p>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error rendering schemes:', error);
        return (
            <div className="p-4 text-red-500">
                Error displaying schemes. Please try again.
            </div>
        );
    }
}