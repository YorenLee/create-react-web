import React, { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { Input, Button, Typography, Alert, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Streamdown } from 'streamdown';
import { code } from '@streamdown/code';
import { math } from '@streamdown/math';
import { cjk } from '@streamdown/cjk';
import { mermaid } from '@streamdown/mermaid';
import 'streamdown/styles.css';
import { useChatStore } from '@/pages/chat/store/chatStore';
import styles from './index.module.less';

const { Text } = Typography;
const { TextArea } = Input;

const streamdownPlugins = { code, math, cjk, mermaid };

const MessageBubble: React.FC<{
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}> = ({ role, content, isStreaming }) => {
    const isUser = role === 'user';

    return (
        <div className={`${styles.messageRow} ${isUser ? styles.userRow : styles.assistantRow}`}>
            <div className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.assistantAvatar}`}>
                {isUser ? <UserOutlined /> : <RobotOutlined />}
            </div>
            <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
                <div className={styles.messageContent}>
                    {isUser ? (
                        content
                    ) : (
                        <Streamdown plugins={streamdownPlugins} isAnimating={isStreaming}>
                            {content}
                        </Streamdown>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ChatUI: React.FC = () => {
    const messages = useChatStore(s => s.messages);
    const loading = useChatStore(s => s.loading);
    const error = useChatStore(s => s.error);
    const sessionId = useChatStore(s => s.sessionId);
    const streamingContent = useChatStore(s => s.streamingContent);
    const sendMessage = useChatStore(s => s.sendMessage);
    const clearError = useChatStore(s => s.clearError);

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);

    const handleSend = () => {
        if (!inputValue.trim() || loading) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <Text strong style={{ fontSize: 16 }}>
                    Agent 对话
                </Text>
                {sessionId && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        会话 #{sessionId}
                    </Text>
                )}
            </div>

            <div className={styles.messagesArea}>
                {messages.length === 0 && !loading && (
                    <div className={styles.emptyState}>
                        <RobotOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                        <Text type="secondary" style={{ marginTop: 16 }}>
                            开始和 Agent 对话吧
                        </Text>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <MessageBubble key={index} role={msg.role} content={msg.content} />
                ))}

                {streamingContent && <MessageBubble role="assistant" content={streamingContent} isStreaming />}

                {loading && !streamingContent && (
                    <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                        <div className={`${styles.avatar} ${styles.assistantAvatar}`}>
                            <RobotOutlined />
                        </div>
                        <div className={`${styles.bubble} ${styles.assistantBubble}`}>
                            <Spin size="small" />
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                                思考中...
                            </Text>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div className={styles.errorBar}>
                    <Alert message={error} type="error" showIcon closable onClose={clearError} />
                </div>
            )}

            <div className={styles.inputArea}>
                <TextArea
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息，Enter 发送，Shift+Enter 换行"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    disabled={loading}
                    className={styles.textArea}
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    disabled={!inputValue.trim() || loading}
                    className={styles.sendButton}
                />
            </div>
        </div>
    );
};
