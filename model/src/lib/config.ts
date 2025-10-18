export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'text-embedding-3-large',
  },
  gemini: {
    apiKey: process.env.GOOGLE_API_KEY || 'your gemini api here',
    model: process.env.GEMINI_MODEL_NAME || 'gemini-2.5-pro',
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || 'pcsk_73fzGC_EkqGu38kPmvQGKPDv3pcZ4WQ4oDTAorq5uyEYsxsgWB9GaX34MMMCmGvFQiBWJp',
    region: process.env.PINECONE_REGION || 'us-east-1',
    textIndex: process.env.TEXT_INDEX_NAME || 'my-multimodal-rag-text',
    imageIndex: process.env.IMAGE_INDEX_NAME || 'my-multimodal-rag-image',
  },
  retrieval: {
    topKText: parseInt(process.env.TOP_K_TEXT || '5'),
    topKImage: parseInt(process.env.TOP_K_IMAGE || '3'),
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
};

export const validateEnvVars = () => {
  // Optional validation since we have default values
  const optionalVars = [
    'OPENAI_API_KEY',
    'GOOGLE_API_KEY',
    'PINECONE_API_KEY', 
    'PINECONE_REGION',
    'TEXT_INDEX_NAME',
    'IMAGE_INDEX_NAME'
  ];
  
  console.log('Environment variables loaded:', {
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasGemini: !!process.env.GOOGLE_API_KEY,
    hasPinecone: !!process.env.PINECONE_API_KEY,
    pineconeRegion: process.env.PINECONE_REGION || 'us-east-1',
    textIndex: process.env.TEXT_INDEX_NAME || 'my-multimodal-rag-text',
    imageIndex: process.env.IMAGE_INDEX_NAME || 'my-multimodal-rag-image'
  });
};
