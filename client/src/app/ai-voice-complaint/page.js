'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaUser, FaFileAlt, FaMapMarkerAlt, FaCalendarAlt, FaRobot, FaBrain, FaSpinner } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import FloatingPanicButton from '../../components/FloatingPanicButton';

export default function AIVoiceComplaint() {
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [fullTranscript, setFullTranscript] = useState('');
    const [complaintData, setComplaintData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        date: '',
        reporterName: '',
        priority: 'medium',
        summary: '',
        recommendations: '',
        evidence_required: '',
        affected_parties: '',
        compliance_issues: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [currentPhase, setCurrentPhase] = useState('ready'); // ready, listening, recorded, analyzing, reviewing, submitting
    const [microphoneAccess, setMicrophoneAccess] = useState(null); // null, granted, denied
    const [audioLevel, setAudioLevel] = useState(0);
    
    const recognitionRef = useRef(null);
    const genAI = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);

    // Check microphone access on component mount
    useEffect(() => {
        const checkMicrophoneAccess = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setMicrophoneAccess('granted');
                stream.getTracks().forEach(track => track.stop()); // Stop the test stream
            } catch (error) {
                console.error('Microphone access check failed:', error);
                setMicrophoneAccess('denied');
            }
        };

        checkMicrophoneAccess();
    }, []);

    // Audio level monitoring
    const startAudioLevelMonitoring = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                } 
            });
            
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
            
            // More sensitive settings for audio detection
            analyserRef.current.fftSize = 512;
            analyserRef.current.smoothingTimeConstant = 0.3;
            
            microphoneRef.current.connect(analyserRef.current);
            
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            
            const updateAudioLevel = () => {
                if (analyserRef.current && isListening) {
                    analyserRef.current.getByteFrequencyData(dataArray);
                    
                    // Calculate RMS (Root Mean Square) for better audio level detection
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i] * dataArray[i];
                    }
                    const rms = Math.sqrt(sum / dataArray.length);
                    
                    // Scale and normalize the audio level (0-100)
                    const normalizedLevel = Math.min(100, Math.max(0, (rms / 128) * 100));
                    setAudioLevel(normalizedLevel);
                    
                    requestAnimationFrame(updateAudioLevel);
                }
            };
            
            updateAudioLevel();
        } catch (error) {
            console.error('Audio level monitoring failed:', error);
            // Set a default level so it doesn&apos;t show &quot;No audio detected&quot;
            setAudioLevel(50);
        }
    };

    const stopAudioLevelMonitoring = () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (microphoneRef.current) {
            microphoneRef.current.disconnect();
            microphoneRef.current = null;
        }
        if (analyserRef.current) {
            analyserRef.current = null;
        }
        setAudioLevel(0);
    };

    // Initialize Gemini AI
    useEffect(() => {
        // Initialize Gemini - In production, use environment variables
        const API_KEY = "your api here"; // Replace with your API key
        genAI.current = new GoogleGenerativeAI(API_KEY);
    }, []);

    // Initialize speech recognition and Gemini AI
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize speech recognition
            if ('webkitSpeechRecognition' in window) {
                recognitionRef.current = new window.webkitSpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';
                recognitionRef.current.maxAlternatives = 1;
                
                // More sensitive settings for better speech detection
                recognitionRef.current.serviceURI = '';
                
                recognitionRef.current.onstart = () => {
                    console.log('Speech recognition started');
                    setCurrentPhase('listening');
                };

                recognitionRef.current.onresult = (event) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + ' ';
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    setTranscript(interimTranscript);
                    
                    if (finalTranscript) {
                        setFullTranscript(prev => prev + finalTranscript);
                    }
                };

                recognitionRef.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    
                    if (event.error === 'no-speech') {
                        // Don&apos;t stop listening for no-speech errors, just continue
                        console.log('No speech detected, but continuing to listen...');
                        return;
                    }
                    
                    if (event.error === 'audio-capture') {
                        alert('Microphone access denied. Please allow microphone access and try again.');
                    } else if (event.error === 'not-allowed') {
                        alert('Microphone permission denied. Please enable microphone access in your browser settings.');
                    } else if (event.error === 'network') {
                        console.log('Network error, continuing to listen...');
                        return; // Don&apos;t stop for network errors
                    }
                    
                    // Only stop for serious errors
                    if (event.error !== 'no-speech' && event.error !== 'network') {
                        setIsListening(false);
                        setCurrentPhase('ready');
                    }
                };

                recognitionRef.current.onend = () => {
                    console.log('Speech recognition ended');
                    if (isListening) {
                        // If we're still supposed to be listening, restart immediately
                        console.log('Restarting recognition...');
                        setTimeout(() => {
                            if (recognitionRef.current && isListening) {
                                try {
                                    recognitionRef.current.start();
                                } catch (error) {
                                    console.log('Error restarting recognition:', error);
                                }
                            }
                        }, 100);
                    }
                };

                recognitionRef.current.onnomatch = () => {
                    console.log('No speech was recognized');
                };

                recognitionRef.current.onsoundstart = () => {
                    console.log('Sound detected');
                };

                recognitionRef.current.onspeechstart = () => {
                    console.log('Speech detected');
                };

                recognitionRef.current.onspeechend = () => {
                    console.log('Speech ended');
                };
            } else {
                alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            stopAudioLevelMonitoring();
        };
    }, [isListening]);

    const startListening = async () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not available in this browser.');
            return;
        }

        // Request microphone permission first
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error) {
            console.error('Microphone permission denied:', error);
            alert('Please allow microphone access to use voice complaint feature.');
            return;
        }

        if (!isListening) {
            setTranscript('');
            setFullTranscript('');
            setCurrentPhase('listening');
            setIsListening(true);
            
            // Start audio level monitoring
            startAudioLevelMonitoring();
            
            try {
                recognitionRef.current.start();
                console.log('Started speech recognition');
            } catch (error) {
                console.error('Error starting recognition:', error);
                setIsListening(false);
                setCurrentPhase('ready');
                stopAudioLevelMonitoring();
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            setIsListening(false);
            recognitionRef.current.stop();
            stopAudioLevelMonitoring();
            console.log('Stopped speech recognition');
            
            // Move to recorded phase and wait for user to click analyze
            setTimeout(() => {
                if (fullTranscript.trim().length > 10) {
                    setCurrentPhase('recorded');
                } else {
                    setCurrentPhase('ready');
                    alert('Please record a longer complaint. Try speaking for at least 10-15 seconds.');
                }
            }, 1000);
        }
    };

    const startAnalysis = () => {
        if (fullTranscript.trim().length > 10) {
            analyzeComplaintWithGemini();
        } else {
            alert('No transcript found. Please record your complaint first.');
        }
    };

    const analyzeComplaintWithGemini = async () => {
        setIsAnalyzing(true);
        setCurrentPhase('analyzing');

        try {
            const model = genAI.current.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
            You are an expert complaint analysis AI for an anonymous whistleblowing platform. Analyze the following complaint transcript and extract structured information. 
            
            User's Complaint Transcript: "${fullTranscript}"
            
            Please analyze this complaint thoroughly and provide a structured response in the following JSON format:
            {
                "title": "Brief, professional title for the complaint (max 100 characters)",
                "category": "Choose from: corruption, misconduct, fraud, harassment, discrimination, safety_violation, environmental, financial, other",
                "description": "Detailed, well-structured description of the complaint with proper paragraphs and professional language",
                "location": "Location where incident occurred (extract from transcript or mark as 'Not specified')",
                "date": "Date/time when incident occurred (extract from transcript, use relative terms like 'recent', 'last week', etc. if specific date not given)",
                "reporterName": "Reporter's name if mentioned, otherwise 'Anonymous'",
                "priority": "Assess priority as: low, medium, high, critical based on severity and potential impact",
                "summary": "Professional executive summary of the key points (2-3 sentences)",
                "recommendations": "Suggested next steps, investigation actions, or escalation procedures based on the complaint type and severity",
                "evidence_required": "List of additional evidence or documentation that should be collected",
                "affected_parties": "Identify who might be affected by this issue",
                "compliance_issues": "Any potential legal, regulatory, or policy violations identified"
            }
            
            Make sure to:
            - Extract all relevant details from the user's speech
            - Use professional, formal language throughout
            - Categorize appropriately based on the content
            - Assess priority based on severity, urgency, and potential impact
            - Provide actionable, specific recommendations
            - Consider legal and compliance implications
            - Structure the description with clear paragraphs
            
            Return ONLY the JSON object, no additional text.
            `;

            console.log('Sending request to Gemini API...');
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const analysisText = response.text();
            
            console.log('Gemini API response:', analysisText);

            // Clean the response to ensure it's valid JSON
            let cleanedAnalysis = analysisText.trim();
            if (cleanedAnalysis.startsWith('```json')) {
                cleanedAnalysis = cleanedAnalysis.replace(/```json\n?/, '').replace(/\n?```$/, '');
            }

            // Parse the JSON response
            const analysisData = JSON.parse(cleanedAnalysis);
            
            setComplaintData(analysisData);
            setAnalysisComplete(true);
            setCurrentPhase('reviewing');
            
            console.log('Analysis complete:', analysisData);

        } catch (error) {
            console.error('Error analyzing complaint with Gemini:', error);
            alert('Error analyzing complaint. Please check your internet connection and try again.');
            setCurrentPhase('recorded');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleVoiceCommand = (command) => {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('submit') || lowerCommand.includes('file') || lowerCommand.includes('confirm')) {
            submitComplaint();
        } else if (lowerCommand.includes('modify') || lowerCommand.includes('change') || lowerCommand.includes('edit')) {
            setAnalysisComplete(false);
            setCurrentPhase('ready');
            setComplaintData({
                title: '', description: '', category: '', location: '',
                date: '', reporterName: '', priority: 'medium', summary: '', 
                recommendations: '', evidence_required: '', affected_parties: '', compliance_issues: ''
            });
        }
    };

    const submitComplaint = async () => {
        setCurrentPhase('submitting');
        
        try {
            // Generate unique complaint ID
            const complaintId = 'CMP-' + Date.now().toString().slice(-8);
            const timestamp = new Date().toISOString();
            
            // Create comprehensive complaint object
            const complaintSubmission = {
                id: complaintId,
                timestamp: timestamp,
                status: 'submitted',
                originalTranscript: fullTranscript,
                analyzedData: complaintData,
                metadata: {
                    submissionMethod: 'ai_voice',
                    wordCount: fullTranscript.split(' ').length,
                    analysisEngine: 'gemini-2.5-flash',
                    submissionDate: new Date().toLocaleDateString(),
                    submissionTime: new Date().toLocaleTimeString()
                }
            };

            console.log('Submitting complaint:', complaintSubmission);

            // Simulate API call to submit complaint
            // In a real application, this would send to your backend API
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        complaintId: complaintId,
                        message: 'Complaint submitted successfully'
                    });
                }, 2000);
            });

            if (response.success) {
                // Store complaint data locally (in real app, this would be handled by the API)
                const existingComplaints = JSON.parse(localStorage.getItem('userComplaints') || '[]');
                existingComplaints.push(complaintSubmission);
                localStorage.setItem('userComplaints', JSON.stringify(existingComplaints));
                localStorage.setItem('lastComplaint', JSON.stringify(complaintSubmission));

                // Show success message
                alert(`Complaint submitted successfully!\n\nComplaint ID: ${complaintId}\n\nYou will be redirected to the dashboard where you can track your complaint status.`);
                
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Error submitting complaint. Please try again.');
            setCurrentPhase('reviewing');
        }
    };

    const getPhaseDescription = () => {
        switch(currentPhase) {
            case 'ready':
                return 'Ready to listen to your complaint';
            case 'listening':
                return 'Listening to your complaint...';
            case 'recorded':
                return 'Complaint recorded - Ready for analysis';
            case 'analyzing':
                return 'AI is analyzing your complaint...';
            case 'reviewing':
                return 'Review the generated complaint details';
            case 'submitting':
                return 'Submitting your complaint...';
            default:
                return 'AI Voice Complaint System';
        }
    };

    const getPhaseProgress = () => {
        switch(currentPhase) {
            case 'ready': return 0;
            case 'listening': return 20;
            case 'recorded': return 40;
            case 'analyzing': return 60;
            case 'reviewing': return 80;
            case 'submitting': return 100;
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-[#383f51] text-white">
            {/* Header */}
            <header className="bg-[#2d3142] shadow-lg border-b border-[#AB9F9D]/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                        >
                            <FaArrowLeft />
                            <span>Back to Dashboard</span>
                        </button>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <FaBrain className="text-purple-400" />
                            AI Voice Complaint System
                        </h1>
                        <div className="w-32"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/70">{getPhaseDescription()}</span>
                        <span className="text-sm text-white/70">{Math.round(getPhaseProgress())}% Complete</span>
                    </div>
                    <div className="w-full bg-[#4a5568] rounded-full h-3">
                        <div 
                            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${getPhaseProgress()}%` }}
                        ></div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Voice Interface */}
                    <div className="bg-[#4a5568] rounded-xl p-6 border border-[#AB9F9D]/30">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FaRobot className="text-purple-400" />
                            AI Voice Assistant
                            {microphoneAccess === 'granted' && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                            {microphoneAccess === 'denied' && <div className="w-2 h-2 bg-red-400 rounded-full"></div>}
                        </h2>

                        {/* Microphone Access Status */}
                        {microphoneAccess === 'denied' && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <div className="flex items-center gap-2 text-red-400 mb-2">
                                    <FaExclamationTriangle />
                                    <span className="font-medium">Microphone Access Required</span>
                                </div>
                                <p className="text-sm text-red-300">
                                    Please allow microphone access in your browser to use the voice complaint feature.
                                    Click the microphone icon in your browser&apos;s address bar and select &quot;Allow&quot;.
                                </p>
                            </div>
                        )}

                        {/* Current Phase Status */}
                        <div className="mb-6 p-4 bg-[#383f51] rounded-lg border border-purple-500/30">
                            <div className="flex items-center gap-3 mb-2">
                                {currentPhase === 'ready' && <FaMicrophone className="text-purple-400" />}
                                {currentPhase === 'listening' && <FaMicrophone className="text-purple-400 animate-pulse" />}
                                {currentPhase === 'recorded' && <FaCheckCircle className="text-green-400" />}
                                {currentPhase === 'analyzing' && <FaBrain className="text-blue-400 animate-spin" />}
                                {currentPhase === 'reviewing' && <FaFileAlt className="text-green-400" />}
                                {currentPhase === 'submitting' && <FaSpinner className="text-yellow-400 animate-spin" />}
                                <h3 className="text-lg font-semibold capitalize">{currentPhase} Phase</h3>
                            </div>
                            <p className="text-white/70 text-sm">
                                {currentPhase === 'ready' && "Click the microphone button to start recording your complaint."}
                                {currentPhase === 'listening' && "Speak your complaint naturally. The system is capturing everything you say."}
                                {currentPhase === 'recorded' && "Recording complete! Click 'Analyze with AI' to process your complaint."}
                                {currentPhase === 'analyzing' && "AI is processing your speech and creating a structured complaint report."}
                                {currentPhase === 'reviewing' && "Review the AI-generated complaint details and click submit when ready."}
                                {currentPhase === 'submitting' && "Securely submitting your complaint to the system."}
                            </p>
                        </div>

                        {/* Voice Controls */}
                        <div className="flex flex-col items-center gap-6">
                            {/* Main Action Button */}
                            {currentPhase === 'ready' || currentPhase === 'listening' ? (
                                <div className="flex flex-col items-center gap-4">
                                    <button
                                        onClick={isListening ? stopListening : startListening}
                                        disabled={isAnalyzing || microphoneAccess === 'denied'}
                                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-3 relative ${
                                            isListening 
                                                ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/20 animate-pulse' 
                                                : microphoneAccess === 'denied'
                                                ? 'bg-gray-500 border-gray-400 opacity-50 cursor-not-allowed'
                                                : 'bg-purple-600 border-purple-500 hover:bg-purple-700'
                                        }`}
                                    >
                                        {isListening ? (
                                            <FaMicrophoneSlash className="text-white text-3xl" />
                                        ) : (
                                            <FaMicrophone className="text-white text-3xl" />
                                        )}
                                        
                                        {/* Audio Level Indicator */}
                                        {isListening && (
                                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-1 h-4 rounded ${
                                                                audioLevel > (i + 1) * 10 
                                                                    ? 'bg-green-400' 
                                                                    : 'bg-gray-600'
                                                            } transition-colors`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Recording Instructions */}
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-white mb-1">
                                            {isListening ? 'Click to Stop Recording' : 'Click to Start Recording'}
                                        </p>
                                        <p className="text-xs text-white/60">
                                            {isListening ? 'Speak clearly about your complaint' : 'Make sure your microphone is working'}
                                        </p>
                                    </div>
                                </div>
                            ) : currentPhase === 'recorded' ? (
                                <div className="flex flex-col items-center gap-4">
                                    <button
                                        onClick={startAnalysis}
                                        disabled={isAnalyzing}
                                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-lg flex items-center gap-2"
                                    >
                                        <FaBrain className={isAnalyzing ? "animate-spin" : ""} />
                                        {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                                    </button>
                                    
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-white mb-1">
                                            Recording Complete
                                        </p>
                                        <p className="text-xs text-white/60">
                                            {fullTranscript.split(' ').length} words captured - Ready for AI analysis
                                        </p>
                                    </div>
                                </div>
                            ) : currentPhase === 'analyzing' ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-24 h-24 rounded-full bg-blue-500 border-3 border-blue-400 flex items-center justify-center animate-pulse">
                                        <FaBrain className="text-white text-3xl animate-spin" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-blue-400 mb-1">
                                            Gemini 2.5 Flash Processing...
                                        </p>
                                        <p className="text-xs text-white/60">
                                            Advanced AI is analyzing your complaint
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleVoiceCommand('submit')}
                                        disabled={currentPhase === 'submitting'}
                                        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-lg"
                                    >
                                        Submit Complaint
                                    </button>
                                    <button
                                        onClick={() => handleVoiceCommand('modify')}
                                        disabled={currentPhase === 'submitting'}
                                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-lg"
                                    >
                                        Record Again
                                    </button>
                                </div>
                            )}

                            {/* Status Display */}
                            <div className="text-center">
                                {isListening && (
                                    <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm">Recording your complaint...</span>
                                        {audioLevel > 20 && <span className="text-xs text-green-400">(Good audio level)</span>}
                                        {audioLevel <= 20 && audioLevel > 5 && <span className="text-xs text-yellow-400">(Speak louder)</span>}
                                        {audioLevel <= 5 && <span className="text-xs text-orange-400">(Try speaking closer to mic)</span>}
                                    </div>
                                )}
                                {isAnalyzing && (
                                    <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                                        <FaBrain className="animate-spin text-sm" />
                                        <span className="text-sm">AI is analyzing your speech...</span>
                                    </div>
                                )}
                                {currentPhase === 'ready' && microphoneAccess === 'granted' && (
                                    <span className="text-sm text-white/60">Click microphone to start recording</span>
                                )}
                                {analysisComplete && (
                                    <span className="text-sm text-green-400">Analysis complete! Review and submit below.</span>
                                )}
                            </div>

                            {/* Live Speech-to-Text Display */}
                            {(transcript || fullTranscript) && (
                                <div className="w-full bg-[#383f51] rounded-lg p-4 border border-[#AB9F9D]/30 max-h-48 overflow-y-auto">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaMicrophone className="text-purple-400 text-sm" />
                                        <h4 className="text-sm font-medium text-purple-400">Speech-to-Text</h4>
                                        {isListening && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-auto"></div>}
                                    </div>
                                    <div className="text-sm text-white/90 leading-relaxed">
                                        <span className="text-white">{fullTranscript}</span>
                                        {transcript && <span className="text-purple-400 bg-purple-400/10 px-1 rounded">{transcript}</span>}
                                    </div>
                                    {fullTranscript && (
                                        <div className="mt-2 pt-2 border-t border-white/10">
                                            <span className="text-xs text-white/50">
                                                {fullTranscript.split(' ').length} words captured • Audio level: {Math.round(audioLevel)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Analyze Button - Show after recording is complete */}
                            {currentPhase === 'recorded' && fullTranscript && (
                                <div className="w-full mt-6">
                                    <div className="text-center mb-4">
                                        <p className="text-sm text-green-400 mb-2">✓ Recording Complete</p>
                                        <p className="text-xs text-white/60">{fullTranscript.split(' ').length} words captured</p>
                                    </div>
                                    <button
                                        onClick={startAnalysis}
                                        disabled={isAnalyzing}
                                        className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-lg flex items-center justify-center gap-3"
                                    >
                                        <FaBrain className={isAnalyzing ? "animate-spin" : ""} />
                                        {isAnalyzing ? 'Analyzing with Gemini 2.5 Flash...' : 'Analyze with Gemini AI'}
                                    </button>
                                    <p className="text-xs text-white/50 text-center mt-2">
                                        AI will analyze your complaint and generate a comprehensive report
                                    </p>
                                </div>
                            )}

                            {/* Microphone Test - Show when no transcript and not listening */}
                            {!transcript && !fullTranscript && !isListening && microphoneAccess === 'granted' && (
                                <div className="w-full bg-[#383f51] rounded-lg p-4 border border-blue-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaMicrophone className="text-blue-400 text-sm" />
                                        <h4 className="text-sm font-medium text-blue-400">Microphone Ready</h4>
                                    </div>
                                    <p className="text-xs text-white/60">
                                        Your microphone is connected and ready. Click the button above to start recording your complaint.
                                    </p>
                                </div>
                            )}

                            {/* Troubleshooting Tips */}
                            {currentPhase === 'ready' && microphoneAccess === 'denied' && (
                                <div className="w-full bg-[#383f51] rounded-lg p-4 border border-yellow-500/30">
                                    <h4 className="text-sm font-medium text-yellow-400 mb-2">Troubleshooting Tips:</h4>
                                    <ul className="text-xs text-white/60 space-y-1">
                                        <li>• Check microphone permissions in browser settings</li>
                                        <li>• Make sure your microphone is not muted</li>
                                        <li>• Try refreshing the page and allowing access</li>
                                        <li>• Use Chrome, Edge, or Safari for best compatibility</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI-Generated Complaint Preview */}
                    <div className="bg-[#4a5568] rounded-xl p-6 border border-[#AB9F9D]/30">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FaBrain className="text-green-400" />
                            AI-Generated Complaint Report
                        </h2>

                        {currentPhase === 'ready' || currentPhase === 'listening' || currentPhase === 'recorded' ? (
                            <div className="flex flex-col items-center justify-center h-96 text-center">
                                <div className="relative mb-6">
                                    {currentPhase === 'ready' && <FaBrain className="text-6xl text-purple-400/30" />}
                                    {currentPhase === 'listening' && (
                                        <>
                                            <FaMicrophone className="text-6xl text-purple-400" />
                                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                        </>
                                    )}
                                    {currentPhase === 'recorded' && (
                                        <>
                                            <FaCheckCircle className="text-6xl text-green-400" />
                                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                                        </>
                                    )}
                                </div>
                                <h3 className="text-lg font-medium text-white/70 mb-2">
                                    {currentPhase === 'ready' && 'Ready to Record'}
                                    {currentPhase === 'listening' && 'Recording in Progress...'}
                                    {currentPhase === 'recorded' && 'Recording Complete'}
                                </h3>
                                <p className="text-sm text-white/50 max-w-md">
                                    {currentPhase === 'ready' && 'Click the microphone to start recording your complaint. Speak naturally and the AI will structure it automatically.'}
                                    {currentPhase === 'listening' && 'Speak your complaint clearly. The system is capturing everything you say and will process it when you\'re done.'}
                                    {currentPhase === 'recorded' && 'Your complaint has been recorded successfully. Click "Analyze with AI" to process your complaint and generate a structured report.'}
                                </p>
                                {currentPhase === 'recorded' && fullTranscript && (
                                    <div className="mt-4 p-3 bg-[#383f51]/50 rounded-lg max-w-md">
                                        <p className="text-xs text-green-400 mb-1">✓ {fullTranscript.split(' ').length} words captured</p>
                                        <p className="text-xs text-white/60">Ready for AI analysis</p>
                                    </div>
                                )}
                            </div>
                        ) : currentPhase === 'analyzing' ? (
                            <div className="flex flex-col items-center justify-center h-96 text-center">
                                <div className="relative mb-6">
                                    <FaBrain className="text-6xl text-blue-400 animate-pulse" />
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-spin"></div>
                                </div>
                                <h3 className="text-lg font-medium text-blue-400 mb-2">AI Processing Your Complaint</h3>
                                <p className="text-sm text-white/50 max-w-md">
                                    Gemini 2.5 Flash is analyzing your complaint and generating a comprehensive report. This may take a few moments...
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-blue-400">
                                    <FaSpinner className="animate-spin" />
                                    <span className="text-sm">Analyzing with Gemini 2.5 Flash...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Title */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-blue-500">
                                    <label className="block text-sm font-medium text-blue-400 mb-1">Complaint Title</label>
                                    <p className="text-white font-medium">{complaintData.title}</p>
                                </div>

                                {/* Category & Priority */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-yellow-500">
                                        <label className="block text-sm font-medium text-yellow-400 mb-1">Category</label>
                                        <p className="text-white capitalize">{complaintData.category.replace('_', ' ')}</p>
                                    </div>
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-red-500">
                                        <label className="block text-sm font-medium text-red-400 mb-1">Priority</label>
                                        <p className="text-white capitalize">{complaintData.priority}</p>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-green-500">
                                    <label className="block text-sm font-medium text-green-400 mb-1">Executive Summary</label>
                                    <p className="text-white/90 text-sm leading-relaxed">{complaintData.summary}</p>
                                </div>

                                {/* Description */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-purple-500">
                                    <label className="block text-sm font-medium text-purple-400 mb-1">Detailed Description</label>
                                    <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{complaintData.description}</p>
                                </div>

                                {/* Location & Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-indigo-500">
                                        <label className="block text-sm font-medium text-indigo-400 mb-1">Location</label>
                                        <p className="text-white/90 text-sm">{complaintData.location}</p>
                                    </div>
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-cyan-500">
                                        <label className="block text-sm font-medium text-cyan-400 mb-1">Date</label>
                                        <p className="text-white/90 text-sm">{complaintData.date}</p>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-orange-500">
                                    <label className="block text-sm font-medium text-orange-400 mb-1">AI Recommendations</label>
                                    <p className="text-white/90 text-sm leading-relaxed">{complaintData.recommendations}</p>
                                </div>

                                {/* Reporter Info */}
                                <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-pink-500">
                                    <label className="block text-sm font-medium text-pink-400 mb-1">Reporter</label>
                                    <p className="text-white/90 text-sm">{complaintData.reporterName}</p>
                                </div>

                                {/* Evidence Required */}
                                {complaintData.evidence_required && (
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-amber-500">
                                        <label className="block text-sm font-medium text-amber-400 mb-1">Evidence Required</label>
                                        <p className="text-white/90 text-sm leading-relaxed">{complaintData.evidence_required}</p>
                                    </div>
                                )}

                                {/* Affected Parties */}
                                {complaintData.affected_parties && (
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-rose-500">
                                        <label className="block text-sm font-medium text-rose-400 mb-1">Affected Parties</label>
                                        <p className="text-white/90 text-sm leading-relaxed">{complaintData.affected_parties}</p>
                                    </div>
                                )}

                                {/* Compliance Issues */}
                                {complaintData.compliance_issues && (
                                    <div className="p-4 bg-[#383f51] rounded-lg border-l-4 border-violet-500">
                                        <label className="block text-sm font-medium text-violet-400 mb-1">Compliance & Legal Issues</label>
                                        <p className="text-white/90 text-sm leading-relaxed">{complaintData.compliance_issues}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Floating Panic Button */}
            <FloatingPanicButton />
        </div>
    );
}
