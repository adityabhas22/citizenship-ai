'use client';

interface Props {
    schemes: string | null;
}

export default function SchemeResults({ schemes }: Props) {
    if (!schemes) {
        return <div className="p-4">Loading schemes...</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Matching Schemes:</h2>
            <div className="space-y-4">
                {schemes === "No matching schemes found." ? (
                    <p className="text-gray-600">{schemes}</p>
                ) : (
                    <pre className="whitespace-pre-wrap font-sans text-gray-700">
                        {schemes}
                    </pre>
                )}
            </div>
        </div>
    );
}