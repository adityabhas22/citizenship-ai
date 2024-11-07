'use client';

interface Props {
    schemes: string | null;
}

export default function SchemeResults({ schemes }: Props) {
    if (!schemes) {
        return <div className="p-4 text-gray-500">No schemes found.</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Matching Schemes:</h2>
            <div className="space-y-4">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {schemes}
                </pre>
            </div>
        </div>
    );
}