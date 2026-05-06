import { useState, useRef, useEffect } from 'react';
import { Send, Settings, Code2, Play, Check } from 'lucide-react';
import Editor from '@monaco-editor/react';
import './App.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeContent, setCodeContent] = useState('// O código GeneXus gerado aparecerá aqui...');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll para o fim das mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extrai código markdown (```genexus ... ```) do texto da IA
  const extractCode = (text: string) => {
    const match = text.match(/```(?:genexus)?\n([\s\S]*?)```/i);
    if (match && match[1]) {
      setCodeContent(match[1].trim());
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content })
      });

      if (!response.ok) throw new Error('Erro na comunicação');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullAssistantMessage = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr.trim() === '[DONE]') break;
              
              try {
                const data = JSON.parse(dataStr);
                fullAssistantMessage += data.content;
                
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId 
                    ? { ...msg, content: fullAssistantMessage }
                    : msg
                ));
                
                // Extrai código em tempo real, se possível
                extractCode(fullAssistantMessage);
              } catch (e) {
                // ignora json incompleto no stream
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { ...msg, content: 'Desculpe, ocorreu um erro ao conectar com a API local.' }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ide-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button className="sidebar-icon active" title="Chat IDE">
          <Code2 size={24} />
        </button>
        <button className="sidebar-icon" title="Configurações">
          <Settings size={24} />
        </button>
      </div>

      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="panel-header">
          GXAgents AI
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-bubble assistant">
              Olá! Sou seu assistente GeneXus local. Como posso te ajudar a modificar ou criar objetos na sua Knowledge Base hoje?
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble ${msg.role}`}>
              {/* Para simplificar, não estamos usando react-markdown ainda. Mas idealmente renderizaríamos aqui */}
              {msg.content.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-bubble assistant typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              placeholder="Descreva a alteração na KB..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button className="send-button" onClick={handleSend} disabled={isLoading}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Panel */}
      <div className="editor-panel">
        <div className="editor-header">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Visualizador de Alterações (Diff / Output)
          </span>
          <button className="apply-button">
            <Check size={16} />
            Aplicar Alterações na KB
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            theme="vs-dark"
            value={codeContent}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              readOnly: true, // O usuário não deve editar manualmente aqui, apenas ler o output da IA (ou podemos liberar e enviar para a KB)
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
