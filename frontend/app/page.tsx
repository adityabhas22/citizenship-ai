import ChatInterface from '../components/chat/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <ChatInterface />
      </div>
    </main>
  );
}
