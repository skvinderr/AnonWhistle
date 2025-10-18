'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaShieldAlt, FaUsers, FaClipboardList, FaChartLine, FaSearch,
    FaFilter, FaEye, FaCheckCircle, FaTimes, FaClock, FaExclamationTriangle,
    FaFileAlt, FaBell, FaPlus, FaHome, FaUserTie, FaBuilding, FaCog,
    FaSignOutAlt, FaChartBar, FaUserShield, FaCalendarAlt, FaDownload,
    FaArrowUp, FaArrowDown, FaRobot, FaVideo, FaImage, FaFileImage,
    FaMicroscope, FaBrain, FaPlay, FaPause, FaSpinner
} from 'react-icons/fa';
import { ChartCard, LineChart, MetricCard } from '../../components/Charts';
import { MdAdminPanelSettings, MdGavel, MdVerifiedUser, MdDashboard, MdAssignment } from 'react-icons/md';

export default function OfficialDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Deepfake Detection States
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisHistory, setAnalysisHistory] = useState([]);

    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [dateRange, setDateRange] = useState('30');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const router = useRouter();

    useEffect(() => {
        // Get user data from localStorage
        const role = localStorage.getItem('userRole');
        const email = localStorage.getItem('userEmail');
        if (!role || !email) {
            router.push('/official-login');
        } else {
            setUserRole(role);
            setUserEmail(email);
        }
    }, [router]);

    // Mock complaints data
    const complaints = [
        {
            id: 'CMP-001',
            title: 'Bribery in License Department',
            department: 'Road Transport',
            status: 'Under Investigation',
            priority: 'High',
            submittedBy: '0xABC...123',
            date: '2025-10-10',
            investigator: 'Officer Kumar',
            description: 'Corruption allegations in driving license issuance process. Officials demanding extra fees for faster processing.',
            evidence: ['document1.pdf', 'audio_recording.mp3', 'photo_evidence.jpg'],
            timeline: [
                { date: '2025-10-10', action: 'Complaint Filed', by: 'Anonymous User' },
                { date: '2025-10-11', action: 'Case Assigned', by: 'Admin' },
                { date: '2025-10-12', action: 'Investigation Started', by: 'Officer Kumar' }
            ],
            location: 'RTO Office, Mumbai',
            category: 'Corruption',
            subcategory: 'Bribery',
            estimatedLoss: '₹5,000',
            witnesses: 2,
            publicSupport: 156
        },
        {
            id: 'CMP-002',
            title: 'Illegal Construction Approval',
            department: 'Urban Development',
            status: 'Pending Review',
            priority: 'Medium',
            submittedBy: '0xDEF...456',
            date: '2025-10-08',
            investigator: 'Unassigned',
            description: 'Building permits issued without proper verification...'
        },
        {
            id: 'CMP-003',
            title: 'Tax Evasion in Municipal Office',
            department: 'Finance',
            status: 'Resolved',
            priority: 'High',
            submittedBy: '0xGHI...789',
            date: '2025-09-25',
            investigator: 'Officer Singh',
            description: 'Irregularities found in tax collection process...'
        },
        {
            id: 'CMP-004',
            title: 'Medical Equipment Procurement Fraud',
            department: 'Health & Family Welfare',
            status: 'Under Investigation',
            priority: 'Critical',
            submittedBy: '0xJKL...012',
            date: '2025-10-12',
            investigator: 'Officer Sharma',
            description: 'Overpricing and quality issues in medical equipment purchase...'
        }
    ];

    // Mock departments data
    const departments = [
        {
            id: 'RTD',
            name: 'Road Transport Department',
            head: 'Mr. Rajesh Kumar',
            totalOfficers: 45,
            totalComplaints: complaints.filter(c => c.department === 'Road Transport').length,
            resolvedRate: 85,
            avgResolutionTime: '12 days',
            budget: '₹2.5 Cr',
            contact: '+91-98765-43210',
            address: 'RTO Complex, Bandra West',
            establishedYear: 1998
        },
        {
            id: 'UDD',
            name: 'Urban Development Department',
            head: 'Ms. Priya Sharma',
            totalOfficers: 62,
            totalComplaints: complaints.filter(c => c.department === 'Urban Development').length,
            resolvedRate: 78,
            avgResolutionTime: '18 days',
            budget: '₹5.2 Cr',
            contact: '+91-98765-43211',
            address: 'Municipal Building, Fort',
            establishedYear: 1985
        },
        {
            id: 'FD',
            name: 'Finance Department',
            head: 'Mr. Suresh Patel',
            totalOfficers: 38,
            totalComplaints: complaints.filter(c => c.department === 'Finance').length,
            resolvedRate: 92,
            avgResolutionTime: '8 days',
            budget: '₹8.7 Cr',
            contact: '+91-98765-43212',
            address: 'Treasury Building, Nariman Point',
            establishedYear: 1975
        },
        {
            id: 'HFW',
            name: 'Health & Family Welfare',
            head: 'Dr. Anjali Desai',
            totalOfficers: 156,
            totalComplaints: complaints.filter(c => c.department === 'Health & Family Welfare').length,
            resolvedRate: 89,
            avgResolutionTime: '15 days',
            budget: '₹12.3 Cr',
            contact: '+91-98765-43213',
            address: 'State Health Directorate, BKC',
            establishedYear: 1960
        }
    ];

    const stats = {
        totalComplaints: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending Review').length,
        investigating: complaints.filter(c => c.status === 'Under Investigation').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        critical: complaints.filter(c => c.priority === 'Critical').length
    };

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    const getPageDescription = (tab) => {
        const descriptions = {
            dashboard: 'Monitor key metrics and recent activities',
            complaints: 'Manage and track all complaint cases',
            'deepfake-detection': 'AI-powered evidence verification and authenticity analysis',
            analytics: 'View detailed performance analytics',
            departments: 'Manage department information',
            users: 'User management and permissions',
            settings: 'System configuration and preferences'
        };
        return descriptions[tab] || 'Manage your tasks efficiently';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <FaCheckCircle className="text-green-400" />;
            case 'Under Investigation': return <FaSearch className="text-yellow-400" />;
            case 'Pending Review': return <FaClock className="text-orange-400" />;
            default: return <FaExclamationTriangle className="text-red-400" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
            case 'High': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
            case 'Medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
            default: return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <MdAdminPanelSettings className="text-red-400" />;
            case 'investigator': return <MdGavel className="text-blue-400" />;
            case 'auditor': return <MdVerifiedUser className="text-green-400" />;
            default: return <FaUsers className="text-purple-400" />;
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'admin': return 'System Administrator';
            case 'investigator': return 'Investigating Officer';
            case 'department_head': return 'Department Head';
            case 'auditor': return 'Compliance Auditor';
            default: return 'Official';
        }
    };

    // Deepfake Detection Functions
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAnalysisResults(null);
        }
    };

    const analyzeWithDeepfakeDetection = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        
        // Simulate AI analysis with realistic delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock analysis results
        const analysisResult = {
            id: `ANALYSIS-${Date.now()}`,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
            timestamp: new Date().toISOString(),
            overall_authenticity: Math.random() > 0.3 ? 'AUTHENTIC' : 'SUSPICIOUS',
            confidence_score: (85 + Math.random() * 15).toFixed(1),
            analysis_details: {
                deepfake_probability: (Math.random() * 30).toFixed(1),
                manipulation_detected: Math.random() > 0.7,
                metadata_analysis: {
                    creation_date: new Date().toISOString().split('T')[0],
                    device_info: 'Camera: Canon EOS R5',
                    gps_location: '19.0760° N, 72.8777° E',
                    software_used: 'Adobe Lightroom CC'
                },
                technical_analysis: {
                    compression_artifacts: Math.random() > 0.5 ? 'Normal' : 'Suspicious',
                    pixel_consistency: Math.random() > 0.3 ? 'Consistent' : 'Inconsistent',
                    noise_pattern: Math.random() > 0.4 ? 'Natural' : 'Artificial'
                }
            },
            ai_engines_used: [
                { name: 'Microsoft Video Authenticator', confidence: (88 + Math.random() * 10).toFixed(1) },
                { name: 'Deepware Scanner', confidence: (85 + Math.random() * 12).toFixed(1) },
                { name: 'FaceForensics++', confidence: (90 + Math.random() * 8).toFixed(1) }
            ],
            recommendations: selectedFile && selectedFile.type.includes('video') ? [
                'Cross-reference with original source if available',
                'Verify timestamp against incident report',
                'Check for additional corroborating evidence'
            ] : [
                'Examine EXIF data for tampering signs',
                'Compare with known authentic samples',
                'Verify metadata consistency'
            ]
        };

        setAnalysisResults(analysisResult);
        setAnalysisHistory(prev => [analysisResult, ...prev]);
        setIsAnalyzing(false);
    };

    const getFileTypeIcon = (fileType) => {
        if (fileType.includes('video')) return <FaVideo className="text-blue-400" />;
        if (fileType.includes('image')) return <FaImage className="text-green-400" />;
        return <FaFileImage className="text-purple-400" />;
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.investigator.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
        const matchesDepartment = filterDepartment === 'all' || complaint.department === filterDepartment;
        const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
    }).sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
            case 'date':
                aVal = new Date(a.date);
                bVal = new Date(b.date);
                break;
            case 'priority':
                const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
                aVal = priorityOrder[a.priority];
                bVal = priorityOrder[b.priority];
                break;
            case 'title':
                aVal = a.title.toLowerCase();
                bVal = b.title.toLowerCase();
                break;
            default:
                return 0;
        }

        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    // Sidebar menu items
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
        { id: 'complaints', label: 'Complaints', icon: FaClipboardList, badge: complaints.length },
        { id: 'deepfake-detection', label: 'AI Evidence Verification', icon: FaRobot },
        { id: 'analytics', label: 'Analytics', icon: FaChartBar },
        { id: 'departments', label: 'Departments', icon: FaBuilding },
        { id: 'users', label: 'Users', icon: FaUsers },
        { id: 'settings', label: 'Settings', icon: FaCog }
    ];

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Total Cases</p>
                            <p className="text-3xl font-bold text-white">{stats.totalComplaints}</p>
                            <div className="flex items-center mt-2 text-sm">
                                <FaArrowUp className="text-green-400 mr-1" />
                                <span className="text-green-400 font-medium">12%</span>
                                <span className="text-white/70 ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="bg-[#DDDBF1] p-3 rounded-full">
                            <FaClipboardList className="text-[#383F51] text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Under Investigation</p>
                            <p className="text-3xl font-bold text-white">{stats.investigating}</p>
                            <div className="flex items-center mt-2 text-sm">
                                <FaArrowUp className="text-amber-300 mr-1" />
                                <span className="text-amber-300 font-medium">Active</span>
                            </div>
                        </div>
                        <div className="bg-[#DDDBF1] p-3 rounded-full">
                            <FaSearch className="text-[#383F51] text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Resolved</p>
                            <p className="text-3xl font-bold text-white">{stats.resolved}</p>
                            <div className="flex items-center mt-2 text-sm">
                                <FaCheckCircle className="text-green-400 mr-1" />
                                <span className="text-green-400 font-medium">85% rate</span>
                            </div>
                        </div>
                        <div className="bg-[#DDDBF1] p-3 rounded-full">
                            <FaCheckCircle className="text-[#383F51] text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Critical Priority</p>
                            <p className="text-3xl font-bold text-white">{stats.critical}</p>
                            <div className="flex items-center mt-2 text-sm">
                                <FaExclamationTriangle className="text-red-400 mr-1" />
                                <span className="text-red-400 font-medium">Urgent</span>
                            </div>
                        </div>
                        <div className="bg-[#DDDBF1] p-3 rounded-full">
                            <FaExclamationTriangle className="text-[#383F51] text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <LineChart
                    title="Monthly Complaint Trends"
                    data={[12, 19, 15, 25, 22, 30, 28]}
                    labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
                    trend={15}
                />
                <ChartCard
                    title="Complaint Categories"
                    type="doughnut"
                    data={[
                        { label: 'Corruption', value: 45, color: '#ef4444' },
                        { label: 'Misconduct', value: 32, color: '#f97316' },
                        { label: 'Fraud', value: 23, color: '#eab308' },
                        { label: 'Other', value: 15, color: '#6b7280' }
                    ]}
                />
                <ChartCard
                    title="Department Performance"
                    data={[
                        { label: 'Police', value: 34 },
                        { label: 'Municipal', value: 28 },
                        { label: 'Healthcare', value: 22 },
                        { label: 'Education', value: 18 },
                        { label: 'Railways', value: 20 }
                    ]}
                />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Complaints */}
                <div className="lg:col-span-2 bg-[#383f51] rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Complaints</h3>
                        <button className="text-white hover:text-blue-700 font-medium text-sm">View All</button>
                    </div>
                    <div className="space-y-4">
                        {complaints.slice(0, 4).map(complaint => (
                            <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-3 h-3 rounded-full ${complaint.status === 'Resolved' ? 'bg-green-500' :
                                        complaint.status === 'Under Investigation' ? 'bg-yellow-500' :
                                            'bg-orange-500'
                                        }`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900">{complaint.title}</p>
                                        <p className="text-sm text-gray-600">{complaint.department} • {complaint.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                                        {complaint.priority}
                                    </span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <FaEye />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#383f51] rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <FaSearch className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Review Pending</p>
                                    <p className="text-sm text-gray-600">{stats.pending} cases waiting</p>
                                </div>
                            </div>
                        </button>

                        <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <FaUserTie className="text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Assign Investigators</p>
                                    <p className="text-sm text-gray-600">Manage assignments</p>
                                </div>
                            </div>
                        </button>

                        <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <FaDownload className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Generate Reports</p>
                                    <p className="text-sm text-gray-600">Export analytics</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderComplaints = () => (
        <div className="space-y-6">
            {/* Enhanced Search and Filters */}
            <div className="bg-[#383F51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                            <input
                                type="text"
                                placeholder="Search by ID, title, department, or investigator..."
                                className="w-full pl-10 pr-4 py-2 bg-[#3C4F76] border border-[#AB9F9D]/30 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-[#DDDBF1] focus:border-[#DDDBF1]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <select
                        className="px-4 py-2 bg-[#3C4F76] border border-[#AB9F9D]/30 text-white rounded-lg focus:ring-2 focus:ring-[#DDDBF1] focus:border-[#DDDBF1]"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Under Investigation">Under Investigation</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                    <select
                        className="px-4 py-2 bg-[#3C4F76] border border-[#AB9F9D]/30 text-white rounded-lg focus:ring-2 focus:ring-[#DDDBF1] focus:border-[#DDDBF1]"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                    >
                        <option value="all">All Departments</option>
                        {[...new Set(complaints.map(c => c.department))].map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-2 bg-[#3C4F76] border border-[#AB9F9D]/30 text-white rounded-lg focus:ring-2 focus:ring-[#DDDBF1] focus:border-[#DDDBF1]"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="all">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#AB9F9D]/30">
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-white/70" />
                        <span className="text-sm font-medium text-white">Sort by:</span>
                        <select
                            className="px-3 py-1 bg-[#3C4F76] border border-[#AB9F9D]/30 text-white rounded text-sm focus:ring-2 focus:ring-[#DDDBF1] focus:border-[#DDDBF1]"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Date</option>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="p-1 hover:bg-[#3C4F76] rounded transition"
                        >
                            {sortOrder === 'asc' ? <FaArrowUp className="text-white/70" /> : <FaArrowDown className="text-white/70" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">Results:</span>
                        <span className="text-sm bg-[#DDDBF1] text-[#383F51] px-2 py-1 rounded font-medium">
                            {filteredComplaints.length} of {complaints.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Complaints List */}
            <div className="bg-[#383F51] rounded-xl shadow-sm border border-[#AB9F9D]/30 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#AB9F9D]/30">
                    <h3 className="text-lg font-semibold text-white">All Complaints ({filteredComplaints.length})</h3>
                </div>
                <div className="divide-y divide-[#AB9F9D]/30">
                    {filteredComplaints.map(complaint => (
                        <div key={complaint.id} className="p-6 hover:bg-[#3C4F76] transition">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <span className="bg-[#DDDBF1] text-[#383F51] font-mono text-sm px-3 py-1 rounded-full">
                                            {complaint.id}
                                        </span>
                                        <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${complaint.status === 'Resolved' ? 'bg-green-900/50 text-green-400' :
                                            complaint.status === 'Under Investigation' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-orange-900/50 text-orange-400'
                                            }`}>
                                            {getStatusIcon(complaint.status)}
                                            <span>{complaint.status}</span>
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                                            {complaint.priority}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-medium text-white mb-2">{complaint.title}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70">
                                        <div>
                                            <span className="font-medium text-white">Department:</span>
                                            <div>{complaint.department}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-white">Submitted:</span>
                                            <div>{complaint.date}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-white">Investigator:</span>
                                            <div>{complaint.investigator}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-white">Reporter:</span>
                                            <div className="font-mono">{complaint.submittedBy}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-6 flex gap-2">
                                    <button
                                        onClick={() => router.push(`/complaint-detail?id=${complaint.id}`)}
                                        className="bg-[#DDDBF1] hover:bg-[#DDDBF1]/80 text-[#383F51] px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                                    >
                                        <FaEye />
                                        View Details
                                    </button>
                                    <button className="bg-[#3C4F76] hover:bg-[#3C4F76]/80 text-white px-4 py-2 rounded-lg font-medium transition">
                                        <FaCog />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDeepfakeDetection = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <FaRobot className="text-2xl" />
                    <h2 className="text-2xl font-bold">AI Evidence Verification</h2>
                </div>
                <p className="opacity-90">Advanced deepfake and forgery detection for uploaded evidence files</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="bg-[#383F51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaMicroscope className="text-blue-400" />
                        Evidence Analysis
                    </h3>
                    
                    <div className="border-2 border-dashed border-[#AB9F9D]/30 rounded-lg p-8 text-center">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="evidence-upload"
                        />
                        <label htmlFor="evidence-upload" className="cursor-pointer">
                            <FaFileImage className="text-4xl text-[#DDDBF1] mx-auto mb-4" />
                            <p className="text-white mb-2">Upload Evidence File</p>
                            <p className="text-white/60 text-sm">Support for images and videos (max 50MB)</p>
                        </label>
                    </div>

                    {selectedFile && (
                        <div className="mt-4 p-4 bg-[#2d3142] rounded-lg border border-[#AB9F9D]/20">
                            <div className="flex items-center gap-3 mb-3">
                                {getFileTypeIcon(selectedFile.type)}
                                <div>
                                    <p className="text-white font-medium">{selectedFile.name}</p>
                                    <p className="text-white/60 text-sm">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={analyzeWithDeepfakeDetection}
                                disabled={isAnalyzing}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <FaBrain />
                                        Analyze with AI
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="bg-[#383F51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaShieldAlt className="text-green-400" />
                        Analysis Results
                    </h3>
                    
                    {analysisResults ? (
                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg border-2 ${
                                analysisResults.overall_authenticity === 'AUTHENTIC'
                                    ? 'bg-green-500/20 border-green-500/30'
                                    : 'bg-red-500/20 border-red-500/30'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-white">Overall Assessment</span>
                                    <span className={`font-bold ${
                                        analysisResults.overall_authenticity === 'AUTHENTIC'
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    }`}>
                                        {analysisResults.overall_authenticity}
                                    </span>
                                </div>
                                <div className="text-white/80 text-sm">
                                    Confidence: {analysisResults.confidence_score}%
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-white">AI Engine Results</h4>
                                {analysisResults.ai_engines_used.map((engine, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-[#2d3142] rounded">
                                        <span className="text-white/80 text-sm">{engine.name}</span>
                                        <span className="text-blue-400 font-medium">{engine.confidence}%</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-white">Technical Analysis</h4>
                                <div className="text-sm space-y-2 text-white/80">
                                    <div>Deepfake Probability: {analysisResults.analysis_details.deepfake_probability}%</div>
                                    <div>Manipulation Detected: {analysisResults.analysis_details.manipulation_detected ? 'Yes' : 'No'}</div>
                                    <div>Compression: {analysisResults.analysis_details.technical_analysis.compression_artifacts}</div>
                                    <div>Pixel Consistency: {analysisResults.analysis_details.technical_analysis.pixel_consistency}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-white">Recommendations</h4>
                                <ul className="space-y-1 text-sm text-white/80">
                                    {analysisResults.recommendations.map((rec, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FaSearch className="text-4xl text-[#AB9F9D] mx-auto mb-4" />
                            <p className="text-white/60">Upload a file to start analysis</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
                <div className="bg-[#383F51] rounded-xl p-6 shadow-sm border border-[#AB9F9D]/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaClock className="text-orange-400" />
                        Analysis History
                    </h3>
                    <div className="space-y-3">
                        {analysisHistory.slice(0, 5).map((analysis) => (
                            <div key={analysis.id} className="flex items-center justify-between p-3 bg-[#2d3142] rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getFileTypeIcon(analysis.fileType)}
                                    <div>
                                        <p className="text-white font-medium">{analysis.fileName}</p>
                                        <p className="text-white/60 text-sm">
                                            {new Date(analysis.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-medium ${
                                        analysis.overall_authenticity === 'AUTHENTIC'
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    }`}>
                                        {analysis.overall_authenticity}
                                    </div>
                                    <div className="text-white/60 text-sm">
                                        {analysis.confidence_score}% confidence
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-6">
            {/* Analytics Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
                <p className="opacity-90">Comprehensive insights into complaint trends and departmental performance</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Resolution Rate"
                    value="87%"
                    change={5.2}
                    icon={FaCheckCircle}
                    color="green"
                />
                <MetricCard
                    title="Avg Response Time"
                    value="2.3 days"
                    change={-12.5}
                    icon={FaClock}
                    color="blue"
                />
                <MetricCard
                    title="Public Satisfaction"
                    value="4.2/5"
                    change={8.1}
                    icon={FaUsers}
                    color="yellow"
                />
                <MetricCard
                    title="Cases This Month"
                    value={stats.totalComplaints}
                    change={15.3}
                    icon={FaClipboardList}
                    color="purple"
                />
            </div>

            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChart
                    title="Monthly Complaint Trends (Last 6 Months)"
                    data={[45, 52, 38, 67, 73, 58]}
                    trend={12.5}
                />
                <ChartCard
                    title="Resolution Status Distribution"
                    type="doughnut"
                    data={[
                        { label: 'Resolved', value: stats.resolved, color: '#10b981' },
                        { label: 'Investigating', value: stats.investigating, color: '#f59e0b' },
                        { label: 'Pending', value: stats.pending, color: '#f97316' }
                    ]}
                />
            </div>

            {/* Department Performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance Analysis</h3>
                <ChartCard
                    title="Cases by Department"
                    data={departments.map(dept => ({
                        label: dept.name.split(' ')[0],
                        value: dept.totalComplaints
                    }))}
                />
            </div>
        </div>
    );

    const renderDepartments = () => (
        <div className="space-y-6">
            {/* Department Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{departments.length}</div>
                        <div className="text-gray-600 mt-1">Total Departments</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {Math.round(departments.reduce((acc, dept) => acc + dept.resolvedRate, 0) / departments.length)}%
                        </div>
                        <div className="text-gray-600 mt-1">Avg Resolution Rate</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {departments.reduce((acc, dept) => acc + dept.totalOfficers, 0)}
                        </div>
                        <div className="text-gray-600 mt-1">Total Officers</div>
                    </div>
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {departments.map(department => (
                    <div key={department.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                                <p className="text-gray-600">Head: {department.head}</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <FaBuilding className="text-blue-600" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{department.totalComplaints}</div>
                                <div className="text-sm text-gray-600">Total Cases</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">{department.resolvedRate}%</div>
                                <div className="text-sm text-gray-600">Resolution Rate</div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Officers:</span>
                                <span className="font-medium">{department.totalOfficers}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Avg Resolution:</span>
                                <span className="font-medium">{department.avgResolutionTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Budget:</span>
                                <span className="font-medium">{department.budget}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Est. Year:</span>
                                <span className="font-medium">{department.establishedYear}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View Details
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium transition">
                                Contact
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'complaints':
                return renderComplaints();
            case 'deepfake-detection':
                return renderDeepfakeDetection();
            case 'analytics':
                return renderAnalytics();
            case 'departments':
                return renderDepartments();
            case 'users':
                return <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center text-gray-600">User management coming soon...</div>;
            case 'settings':
                return <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center text-gray-600">Settings panel coming soon...</div>;
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-[#383F51] flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 ${sidebarOpen ? 'w-64' : 'w-20'} bg-[#383F51] shadow-xl border-r border-[#AB9F9D]/30 transition-all duration-300`}>
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-[#AB9F9D]/30">
                    {sidebarOpen ? (
                        <div className="flex items-center space-x-3">
                            <div className="bg-[#D1BEB0] p-2 rounded-lg">
                                <FaShieldAlt className="text-[#383F51] text-lg" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white">AnonWhistle</div>
                                <div className="text-xs text-white/70">Officials Portal</div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#D1BEB0] p-2 rounded-lg mx-auto">
                            <FaShieldAlt className="text-[#383F51] text-lg" />
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-[#383F51] rounded transition"
                    >
                        <div className="w-1 h-4 bg-[#AB9F9D] rounded"></div>
                    </button>
                </div>

                {/* User Profile in Sidebar */}
                <div className="p-4 border-b border-[#AB9F9D]/30">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#383F51] p-2 rounded-full">
                            {getRoleIcon(userRole)}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">
                                    {getRoleName(userRole)}
                                </div>
                                <div className="text-xs text-white/70 truncate">{userEmail}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2 flex-1">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === item.id
                                    ? 'bg-[#DDDBF1]/20 text-white border border-[#DDDBF1]/30'
                                    : 'text-white/70 hover:bg-[#383F51] hover:text-white'
                                    }`}
                            >
                                <IconComponent className={`text-lg ${activeTab === item.id ? 'text-white' : 'text-white/70'}`} />
                                {sidebarOpen && (
                                    <>
                                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                                        {item.badge && (
                                            <span className="bg-[#DDDBF1]/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-[#AB9F9D]/30">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-red-800/30 hover:text-white rounded-lg transition"
                    >
                        <FaSignOutAlt className="text-lg" />
                        {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* Top Navigation */}
                <div className="bg-[#383f51] shadow-sm border-b border-[#AB9F9D]/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white capitalize">
                                {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
                            </h1>
                            <p className="text-white/70 text-sm mt-1">
                                {getPageDescription(activeTab)}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-white/70 hover:text-white hover:bg-[#383F51] rounded-lg transition">
                                <FaBell className="text-lg" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                    3
                                </span>
                            </button>

                            {/* Export Button */}
                            <button className="bg-[#383F51] hover:bg-[#383F51]/80 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
                                <FaDownload className="text-sm" />
                                Export
                            </button>

                            {/* Add Button */}
                            <button className="bg-[#DDDBF1] hover:bg-[#DDDBF1]/80 text-[#383F51] px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
                                <FaPlus className="text-sm" />
                                New Case
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-6 bg-[#383F51] min-h-screen">
                    {renderContent()}
                </div>
            </div>


        </div>
    );
}