'use client';

interface Props {
    schemes: string | null;
}

export default function SchemeResults({ schemes }: Props) {
    if (!schemes) {
        return <div className="p-4 font-bold text-black">Loading schemes...</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Matching Schemes:</h2>
            <div className="space-y-4">
                {schemes === "No matching schemes found." ? (
                    <p className="text-black font-bold">{schemes}</p>
                ) : (
                    <pre className="whitespace-pre-wrap font-sans text-black font-bold bg-white p-4 rounded-lg">
                        {schemes}
                    </pre>
                )}
            </div>
        </div>
    );
}