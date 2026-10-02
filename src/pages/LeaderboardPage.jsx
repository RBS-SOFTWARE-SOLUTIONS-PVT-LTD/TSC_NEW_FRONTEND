import React, { useState, useEffect, useMemo } from 'react';
import { scoreApi, feedbackApi } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Award, 
  Medal, 
  Star, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Search, 
  Filter, 
  Info, 
  ChevronRight, 
  User, 
  CheckCircle2,
  Crown,
  Flame,
  ShieldCheck,
  RefreshCw,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Share2,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';

export const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'monthly' | 'annual' | 'awards'
  const [liveData, setLiveData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [annualData, setAnnualData] = useState(null);
  const [awardsData, setAwardsData] = useState(null);
  const [highestRatedTutor, setHighestRatedTutor] = useState(null);

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [annualYear, setAnnualYear] = useState(currentDate.getFullYear());

  // Filter & Search & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'top5' | 'gold' | 'high_hours'
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'hours' | 'rating'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  // Selected Tutor for Detailed Dossier Modal
  const [selectedTutorDossier, setSelectedTutorDossier] = useState(null);

  // Confetti celebratory burst
  const triggerConfetti = () => {
    try {
      const count = 120;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio, opts) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ['#D4A72C', '#7A1631', '#E8C866', '#5A1024', '#F59E0B'],
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // safe fallback
    }
  };

  // Load Data Handlers
  const fetchLiveData = async () => {
    setLoading(true);
    setError('');
    try {
      const [liveRes, topTutorRes] = await Promise.all([
        scoreApi.getLiveScores().catch(() => ({ data: { tutorScores: [] } })),
        feedbackApi.getHighestRatedTutor().catch(() => ({ data: null })),
      ]);

      setLiveData(liveRes.data || null);
      setHighestRatedTutor(topTutorRes.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load live leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyData = async (yr, mth) => {
    setLoading(true);
    setError('');
    try {
      const res = await scoreApi.getMonthlyScores(yr, mth);
      setMonthlyData(res.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load monthly scores');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnualData = async (yr) => {
    setLoading(true);
    setError('');
    try {
      const res = await scoreApi.getAnnualScores(yr);
      setAnnualData(res.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load annual standings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAwardsData = async (yr) => {
    setLoading(true);
    setError('');
    try {
      const res = await scoreApi.getAnnualAwards(yr);
      setAwardsData(res.data || null);
      triggerConfetti();
    } catch (err) {
      setError(err.message || 'Failed to load annual awards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'live') {
      fetchLiveData();
    } else if (activeTab === 'monthly') {
      fetchMonthlyData(selectedYear, selectedMonth);
    } else if (activeTab === 'annual') {
      fetchAnnualData(annualYear);
    } else if (activeTab === 'awards') {
      fetchAwardsData(annualYear);
    }
  }, [activeTab]);

  // Current Scores List extracted based on Tab
  const rawScoresList = useMemo(() => {
    if (activeTab === 'live') return liveData?.tutorScores || [];
    if (activeTab === 'monthly') return monthlyData?.tutorScores || [];
    if (activeTab === 'annual') return annualData?.tutorScores || [];
    if (activeTab === 'awards') return awardsData?.tutorAwards || [];
    return [];
  }, [activeTab, liveData, monthlyData, annualData, awardsData]);

  // Processed, Filtered & Sorted List
  const processedScores = useMemo(() => {
    let list = [...rawScoresList];

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.email?.toLowerCase().includes(q) ||
          t.userId?.toLowerCase().includes(q)
      );
    }

    // 2. Quick filter
    if (quickFilter === 'top5') {
      list = list.slice(0, 5);
    } else if (quickFilter === 'gold') {
      list = list.filter((t) => {
        const sc = t.scores?.monthlyScore_MS ?? t.scores?.annualScore_AS ?? t.annualScore_AS ?? 0;
        return sc >= 90 || t.award === 'Gold';
      });
    } else if (quickFilter === 'high_hours') {
      list = list.filter((t) => {
        const hrs = t.metrics?.totalHours ?? t.metrics?.totalAnnualHours ?? 0;
        return hrs >= 10;
      });
    }

    // 3. Sorting
    list.sort((a, b) => {
      const scoreA = a.scores?.monthlyScore_MS ?? a.scores?.annualScore_AS ?? a.annualScore_AS ?? 0;
      const scoreB = b.scores?.monthlyScore_MS ?? b.scores?.annualScore_AS ?? b.annualScore_AS ?? 0;
      const hoursA = a.metrics?.totalHours ?? a.metrics?.totalAnnualHours ?? 0;
      const hoursB = b.metrics?.totalHours ?? b.metrics?.totalAnnualHours ?? 0;
      const ratingA = a.metrics?.averageRating ?? 0;
      const ratingB = b.metrics?.averageRating ?? 0;

      if (sortBy === 'hours') return hoursB - hoursA;
      if (sortBy === 'rating') return ratingB - ratingA;
      return scoreB - scoreA;
    });

    return list;
  }, [rawScoresList, searchQuery, quickFilter, sortBy]);

  // Extract Top 3 for Podium
  const topThreeTutors = useMemo(() => {
    return rawScoresList.slice(0, 3);
  }, [rawScoresList]);

  // Helper for rank badges
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'linear-gradient(135deg, #FFD700 0%, #D4A72C 100%)',
            color: '#3A2700',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.8rem',
            boxShadow: '0 2px 8px rgba(212, 167, 44, 0.4)',
          }}
        >
          <Crown size={14} /> #1 Gold
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'linear-gradient(135deg, #F3F4F6 0%, #D1D5DB 100%)',
            color: '#1F2937',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.8rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Medal size={14} color="#6B7280" /> #2 Silver
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'linear-gradient(135deg, #FDE68A 0%, #CD7F32 100%)',
            color: '#FFFFFF',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.8rem',
            boxShadow: '0 2px 8px rgba(205, 127, 50, 0.35)',
          }}
        >
          <Medal size={14} color="#FFFFFF" /> #3 Bronze
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'var(--bg-surface-alt)',
          color: 'var(--text-secondary)',
          fontWeight: 700,
          fontSize: '0.8rem',
        }}
      >
        #{rank}
      </span>
    );
  };

  const renderAwardTierBadge = (award) => {
    if (award === 'Gold') {
      return (
        <span className="badge badge-gold shimmer-badge" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
          <Crown size={14} style={{ marginRight: '5px' }} /> Gold Honor (≥90)
        </span>
      );
    }
    if (award === 'Silver') {
      return (
        <span className="badge badge-info" style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(59, 130, 246, 0.12)', color: '#2563EB', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <Medal size={14} style={{ marginRight: '5px' }} /> Silver Honor (≥80)
        </span>
      );
    }
    if (award === 'Bronze') {
      return (
        <span className="badge badge-warning" style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
          <Award size={14} style={{ marginRight: '5px' }} /> Bronze Honor (≥70)
        </span>
      );
    }
    return (
      <span className="badge" style={{ background: 'var(--bg-surface-alt)', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '4px 10px' }}>
        Honorary Participant
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* =========================================================================
          1. HERO HEADER: University Academic Distinction & Live Standings
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #4A081A 0%, #7A1631 50%, #30040E 100%)',
          color: '#FAF9F6',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Ambient background lighting */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 85% 15%, rgba(212, 167, 44, 0.28) 0%, transparent 45%),
                              radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.08) 0%, transparent 40%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              {/* Real-time Status Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(212, 167, 44, 0.18)',
                  border: '1px solid rgba(212, 167, 44, 0.4)',
                  color: '#FDE68A',
                  padding: '0.35rem 0.9rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '1rem',
                }}
              >
                <span className="status-dot status-dot-active" />
                <span>Live Peer Tutoring Matrix • University of Kelaniya</span>
              </div>

              <h1
                style={{
                  fontSize: '2.4rem',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: '0.5rem',
                }}
              >
                Tutor Leaderboard & Annual Honors
              </h1>

              <p
                style={{
                  color: 'rgba(250, 249, 246, 0.9)',
                  fontSize: '1rem',
                  maxWidth: '720px',
                  lineHeight: 1.5,
                }}
              >
                Celebrating peer educators recognized for verified teaching hours, continuous academic support, and stellar student evaluation scores.
              </p>
            </div>

            {/* Quick Celebrate Action */}
            <button
              onClick={triggerConfetti}
              className="btn btn-secondary btn-sm"
              style={{
                boxShadow: 'var(--shadow-gold)',
                fontWeight: 700,
                alignSelf: 'flex-start',
              }}
            >
              <Sparkles size={16} /> Celebrate Tutors
            </button>
          </div>

          {/* Interactive Navigation Tabs */}
          <div
            className="horizontal-scroll-chips"
            style={{
              marginTop: '1.75rem',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '6px',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: 'fit-content',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => setActiveTab('live')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === 'live' ? '#3A2700' : '#FAF9F6',
                background: activeTab === 'live' ? 'linear-gradient(135deg, #FFD700 0%, #D4A72C 100%)' : 'transparent',
                boxShadow: activeTab === 'live' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Flame size={16} color={activeTab === 'live' ? '#3A2700' : '#FDE68A'} />
              Live Month Standings
            </button>

            <button
              onClick={() => setActiveTab('monthly')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === 'monthly' ? '#3A2700' : '#FAF9F6',
                background: activeTab === 'monthly' ? 'linear-gradient(135deg, #FFD700 0%, #D4A72C 100%)' : 'transparent',
                boxShadow: activeTab === 'monthly' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Calendar size={16} color={activeTab === 'monthly' ? '#3A2700' : '#FDE68A'} />
              Monthly Archive
            </button>

            <button
              onClick={() => setActiveTab('annual')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === 'annual' ? '#3A2700' : '#FAF9F6',
                background: activeTab === 'annual' ? 'linear-gradient(135deg, #FFD700 0%, #D4A72C 100%)' : 'transparent',
                boxShadow: activeTab === 'annual' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <TrendingUp size={16} color={activeTab === 'annual' ? '#3A2700' : '#FDE68A'} />
              Annual Standings
            </button>

            <button
              onClick={() => setActiveTab('awards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === 'awards' ? '#3A2700' : '#FAF9F6',
                background: activeTab === 'awards' ? 'linear-gradient(135deg, #FFD700 0%, #D4A72C 100%)' : 'transparent',
                boxShadow: activeTab === 'awards' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Award size={16} color={activeTab === 'awards' ? '#3A2700' : '#FDE68A'} />
              Annual Honors Gala
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. HIGHLIGHT BANNER & SCORING DECOMPOSITION
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Tutor Spotlight Card */}
        {highestRatedTutor && (
          <div
            className="card card-gold-accent glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700 0%, #D4A72C 100%)',
                  color: '#3A2700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-gold)',
                }}
              >
                <Crown size={28} color="#3A2700" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary-dark)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Sparkles size={14} /> Highest Rated Peer Mentor
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0.2rem 0' }}>
                  {highestRatedTutor.tutorName || highestRatedTutor.name || 'Verified Tutor'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D97706', fontWeight: 800 }}>
                    <Star size={14} fill="#D97706" /> {highestRatedTutor.averageRating?.toFixed(1) || '5.0'} / 10
                  </span>
                  <span>•</span>
                  <span>{highestRatedTutor.totalFeedbacks || 0} Student Reviews</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTutorDossier({
                name: highestRatedTutor.tutorName || highestRatedTutor.name,
                metrics: { averageRating: (highestRatedTutor.averageRating / 2).toFixed(1), totalFeedbacks: highestRatedTutor.totalFeedbacks },
                award: 'Gold'
              })}
              className="btn btn-outline btn-sm"
              style={{ flexShrink: 0 }}
            >
              Details
            </button>
          </div>
        )}

        {/* Scoring Formula Explainer Card */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '4px solid var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem' }}>
                <Info size={16} /> Transparent Kelaniya Scoring Weights
              </div>
              <button
                onClick={() => setShowFormulaInfo(!showFormulaInfo)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 6px', color: 'var(--primary)' }}
              >
                {showFormulaInfo ? 'Hide Details' : 'Formula Breakdown'}
              </button>
            </div>

            <p style={{ marginTop: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activeTab === 'annual' || activeTab === 'awards' ? (
                <>
                  <strong>Annual Score (AS)</strong> = <code>30% × Annual Hours Score (AHS) + 70% × Average Monthly Score (AMS)</code>.
                  Tutors achieving ≥90 obtain <strong>Gold</strong> honors.
                </>
              ) : (
                <>
                  <strong>Monthly Score (MS)</strong> = <code>40% × Hour Score (HS) + 60% × Rating Score (RS)</code>.
                  Normalized against top peer teaching hours in the university.
                </>
              )}
            </p>
          </div>

          {showFormulaInfo && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-alt)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              • <strong>Hour Score (HS):</strong> (Tutor Hours / Benchmark Highest Hours) × 100<br />
              • <strong>Rating Score (RS):</strong> (Average Rating out of 5 / 5) × 100<br />
              • <strong>Awards Tiers:</strong> Gold (≥90) | Silver (≥80) | Bronze (≥70)
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          3. TOP 3 PODIUM EXPERIENCE (Interactive 3D Visual Cards)
          ========================================================================= */}
      {topThreeTutors.length >= 1 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={20} color="var(--secondary-dark)" />
              Top Performers Podium
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click on any mentor to inspect full dossier
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              alignItems: 'end',
            }}
          >
            {/* Rearranged for Podium aesthetic: [2nd Silver, 1st Gold, 3rd Bronze] if 3 tutors exist */}
            {topThreeTutors.map((item, idx) => {
              const rank = item.rank || idx + 1;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;
              const score = item.scores?.monthlyScore_MS ?? item.scores?.annualScore_AS ?? item.annualScore_AS ?? 0;
              const hours = item.metrics?.totalHours ?? item.metrics?.totalAnnualHours ?? 0;
              const avgRating = item.metrics?.averageRating ?? 0;

              return (
                <div
                  key={item.tutorId || idx}
                  onClick={() => setSelectedTutorDossier(item)}
                  className={`card podium-card ${isFirst ? 'pulse-glow-gold' : ''}`}
                  style={{
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    border: isFirst
                      ? '2px solid var(--secondary)'
                      : isSecond
                      ? '1.5px solid #D1D5DB'
                      : '1.5px solid #CD7F32',
                    background: isFirst
                      ? 'linear-gradient(180deg, rgba(212, 167, 44, 0.12) 0%, var(--bg-surface) 100%)'
                      : 'var(--bg-surface)',
                    boxShadow: isFirst ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
                    order: isFirst ? 1 : isSecond ? 0 : 2,
                  }}
                >
                  <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                    {renderRankBadge(rank)}
                  </div>

                  {/* Avatar */}
                  <div
                    style={{
                      width: isFirst ? '84px' : '70px',
                      height: isFirst ? '84px' : '70px',
                      borderRadius: '50%',
                      margin: '0 auto 1.25rem',
                      background: isFirst
                        ? 'linear-gradient(135deg, #FFD700 0%, #D4A72C 100%)'
                        : isSecond
                        ? 'linear-gradient(135deg, #F3F4F6 0%, #9CA3AF 100%)'
                        : 'linear-gradient(135deg, #CD7F32 0%, #8D5524 100%)',
                      color: isFirst ? '#3A2700' : isSecond ? '#1F2937' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isFirst ? '2rem' : '1.5rem',
                      fontWeight: 900,
                      boxShadow: 'var(--shadow-md)',
                      border: isFirst ? '3px solid #FFF' : '2px solid #FFF',
                    }}
                  >
                    {item.name ? item.name.charAt(0).toUpperCase() : 'T'}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {item.email || `Tutor ID: ${item.userId}`}
                  </p>

                  {/* Score Highlight Dial */}
                  <div
                    style={{
                      background: 'var(--bg-surface-alt)',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {activeTab === 'annual' || activeTab === 'awards' ? 'Annual Score (AS)' : 'Monthly Score (MS)'}
                    </div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 900,
                        color: isFirst ? 'var(--secondary-dark)' : 'var(--primary)',
                        lineHeight: 1.1,
                        marginTop: '2px',
                      }}
                    >
                      {score.toFixed(1)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>points / 100</div>
                  </div>

                  {/* Key metrics row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '0.85rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Tutoring Hours</div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {hours} hrs
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Student Rating</div>
                      <div style={{ fontWeight: 800, color: '#D97706', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'center', marginTop: '2px' }}>
                        <Star size={13} fill="#D97706" /> {avgRating > 0 ? avgRating.toFixed(1) : '5.0'}★
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          4. MODERN FILTER TOOLBAR & CONTROLS
          ========================================================================= */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Input with Instant Clear */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="input"
              placeholder="Search tutor by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem', paddingRight: searchQuery ? '2.4rem' : '1rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
              Filter:
            </span>
            {[
              { id: 'all', label: 'All Tutors' },
              { id: 'top5', label: 'Top 5' },
              { id: 'gold', label: 'Gold (≥90)' },
              { id: 'high_hours', label: '10+ Hours' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setQuickFilter(chip.id)}
                className={`btn btn-sm ${quickFilter === chip.id ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: 'var(--radius-pill)' }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Sort & Month Selector */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpDown size={15} color="var(--text-muted)" />
              <select
                className="select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: 'auto', fontSize: '0.82rem', padding: '6px 28px 6px 10px' }}
              >
                <option value="score">Sort by Score</option>
                <option value="hours">Sort by Teaching Hours</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>

            {/* Tab Specific Date Pickers */}
            {activeTab === 'monthly' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchMonthlyData(selectedYear, selectedMonth);
                }}
                style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}
              >
                <select
                  className="select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  style={{ width: 'auto', fontSize: '0.82rem', padding: '6px 24px 6px 8px' }}
                >
                  <option value={1}>Jan</option>
                  <option value={2}>Feb</option>
                  <option value={3}>Mar</option>
                  <option value={4}>Apr</option>
                  <option value={5}>May</option>
                  <option value={6}>Jun</option>
                  <option value={7}>Jul</option>
                  <option value={8}>Aug</option>
                  <option value={9}>Sep</option>
                  <option value={10}>Oct</option>
                  <option value={11}>Nov</option>
                  <option value={12}>Dec</option>
                </select>

                <select
                  className="select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={{ width: 'auto', fontSize: '0.82rem', padding: '6px 24px 6px 8px' }}
                >
                  {[2024, 2025, 2026, 2027].map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>

                <button type="submit" className="btn btn-primary btn-sm">
                  Apply
                </button>
              </form>
            )}

            {(activeTab === 'annual' || activeTab === 'awards') && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (activeTab === 'annual') fetchAnnualData(annualYear);
                  else fetchAwardsData(annualYear);
                }}
                style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}
              >
                <select
                  className="select"
                  value={annualYear}
                  onChange={(e) => setAnnualYear(Number(e.target.value))}
                  style={{ width: 'auto', fontSize: '0.82rem', padding: '6px 24px 6px 8px' }}
                >
                  {[2024, 2025, 2026, 2027].map((yr) => (
                    <option key={yr} value={yr}>Academic {yr}</option>
                  ))}
                </select>

                <button type="submit" className="btn btn-primary btn-sm">
                  Apply
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. ANNUAL HONORS GALA SHOWCASE (Awards Tab)
          ========================================================================= */}
      {activeTab === 'awards' && awardsData?.awardSummary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary Stat Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div className="card card-gold-accent" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: 800, fontSize: '0.85rem' }}>
                <Crown size={18} /> Gold Medalists (≥90)
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--secondary-dark)', marginTop: '0.3rem' }}>
                {awardsData.awardSummary.goldCount} Tutors
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #9CA3AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563', fontWeight: 800, fontSize: '0.85rem' }}>
                <Medal size={18} /> Silver Medalists (≥80)
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#374151', marginTop: '0.3rem' }}>
                {awardsData.awardSummary.silverCount} Tutors
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #CD7F32' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CD7F32', fontWeight: 800, fontSize: '0.85rem' }}>
                <Award size={18} /> Bronze Medalists (≥70)
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#8D5524', marginTop: '0.3rem' }}>
                {awardsData.awardSummary.bronzeCount} Tutors
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem' }}>
                <GraduationCap size={18} /> Total Evaluated
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.3rem' }}>
                {awardsData.awardSummary.totalTutors}
              </div>
            </div>
          </div>

          {/* Gala Certificate Showcase Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {processedScores.slice(0, 6).map((tutor, idx) => (
              <div
                key={tutor.tutorId || idx}
                onClick={() => setSelectedTutorDossier(tutor)}
                className="card card-interactive"
                style={{
                  padding: '1.5rem',
                  border: tutor.award === 'Gold' ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                  background: tutor.award === 'Gold' ? 'linear-gradient(145deg, #FFFFFF 0%, #FDFBF7 100%)' : '#FFFFFF',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  {renderAwardTierBadge(tutor.award)}
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Rank #{tutor.rank || idx + 1}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{tutor.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {tutor.email || `Tutor ID: ${tutor.userId}`}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Annual Score</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)' }}>
                      {(tutor.annualScore_AS || tutor.scores?.annualScore_AS || 0).toFixed(1)}
                    </div>
                  </div>

                  <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>
                    Inspect Dossier <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MAIN LEADERBOARD TABLE WITH INTERACTIVE ROWS
          ========================================================================= */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Compiling verified peer score calculations...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--error)' }}>
            <p>{error}</p>
            <button onClick={fetchLiveData} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : processedScores.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Trophy size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3>No Tutor Standings Found</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              No recorded tutor evaluations match your filter query.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-alt)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.25rem', width: '110px' }}>Rank</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Peer Tutor</th>
                  {activeTab !== 'awards' && (
                    <>
                      <th style={{ padding: '1rem 1.25rem' }}>Teaching Hours</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Quality Rating</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Hour Score (HS)</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Rating Score (RS)</th>
                    </>
                  )}
                  {activeTab === 'awards' && (
                    <th style={{ padding: '1rem 1.25rem' }}>Academic Honors</th>
                  )}
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {activeTab === 'annual' || activeTab === 'awards' ? 'Annual Score (AS)' : 'Monthly Score (MS)'}
                  </th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', width: '90px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {processedScores.map((tutor, idx) => {
                  const rank = tutor.rank || idx + 1;
                  const score =
                    tutor.scores?.monthlyScore_MS ??
                    tutor.scores?.annualScore_AS ??
                    tutor.annualScore_AS ??
                    0;
                  const hours = tutor.metrics?.totalHours ?? tutor.metrics?.totalAnnualHours ?? 0;
                  const rating = tutor.metrics?.averageRating ?? 0;
                  const hs = tutor.scores?.hourScore_HS ?? tutor.scores?.annualHourScore_AHS ?? 0;
                  const rs = tutor.scores?.ratingScore_RS ?? tutor.scores?.averageMonthlyScore_AMS ?? 0;
                  const award = tutor.award || tutor.scores?.award;

                  return (
                    <tr
                      key={tutor.tutorId || idx}
                      onClick={() => setSelectedTutorDossier(tutor)}
                      className="rank-row-hover"
                      style={{
                        borderBottom: '1px solid var(--border-light)',
                        backgroundColor: rank <= 3 ? 'rgba(212, 167, 44, 0.03)' : 'transparent',
                      }}
                    >
                      {/* Rank */}
                      <td style={{ padding: '1rem 1.25rem' }}>{renderRankBadge(rank)}</td>

                      {/* Tutor Profile */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.9rem',
                            }}
                          >
                            {tutor.name ? tutor.name.charAt(0).toUpperCase() : 'T'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{tutor.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {tutor.email || `ID: ${tutor.userId}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Detailed Metrics */}
                      {activeTab !== 'awards' && (
                        <>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                              <Clock size={15} color="var(--secondary-dark)" /> {hours} hrs
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {tutor.metrics?.totalSessions || tutor.metrics?.totalAnnualSessions || 0} classes
                            </div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 800, color: '#D97706' }}>
                              <Star size={14} fill="#D97706" /> {rating > 0 ? rating.toFixed(1) : '5.0'}★
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {tutor.metrics?.totalFeedbacks || 0} reviews
                            </div>
                          </td>

                          {/* Progress bar HS */}
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '42px' }}>{hs.toFixed(0)}%</span>
                              <div style={{ width: '70px', height: '6px', background: 'var(--bg-surface-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(hs, 100)}%`, height: '100%', background: '#3B82F6' }} />
                              </div>
                            </div>
                          </td>

                          {/* Progress bar RS */}
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '42px' }}>{rs.toFixed(0)}%</span>
                              <div style={{ width: '70px', height: '6px', background: 'var(--bg-surface-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(rs, 100)}%`, height: '100%', background: '#D4A72C' }} />
                              </div>
                            </div>
                          </td>
                        </>
                      )}

                      {/* Award Badge in Awards tab */}
                      {activeTab === 'awards' && (
                        <td style={{ padding: '1rem 1.25rem' }}>{renderAwardTierBadge(award)}</td>
                      )}

                      {/* Total Score */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '1.35rem',
                            fontWeight: 900,
                            color: rank === 1 ? 'var(--secondary-dark)' : 'var(--primary)',
                          }}
                        >
                          {score.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>points</div>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTutorDossier(tutor);
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        >
                          Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          7. TUTOR ACHIEVEMENT DOSSIER MODAL (Rich UX Inspection Drawer)
          ========================================================================= */}
      {selectedTutorDossier && (
        <div className="modal-backdrop" onClick={() => setSelectedTutorDossier(null)}>
          <div
            className="modal-content glass-panel"
            style={{ maxWidth: '580px', width: '100%', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Avatar & Rank */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    boxShadow: 'var(--shadow-maroon)',
                  }}
                >
                  {selectedTutorDossier.name ? selectedTutorDossier.name.charAt(0).toUpperCase() : 'T'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <Sparkles size={13} /> Verified Faculty Peer Tutor
                  </div>
                  <h3 style={{ fontSize: '1.35rem', margin: '2px 0' }}>{selectedTutorDossier.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {selectedTutorDossier.email || `Tutor ID: ${selectedTutorDossier.userId || '-'}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTutorDossier(null)}
                className="btn btn-ghost"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Score & Rank Highlight Pill */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(122, 22, 49, 0.08) 0%, rgba(212, 167, 44, 0.12) 100%)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(212, 167, 44, 0.25)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Official Standing & Score
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {(selectedTutorDossier.scores?.monthlyScore_MS ?? selectedTutorDossier.scores?.annualScore_AS ?? selectedTutorDossier.annualScore_AS ?? 0).toFixed(1)}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}> / 100</span>
                </div>
              </div>

              <div>
                {renderRankBadge(selectedTutorDossier.rank || 1)}
              </div>
            </div>

            {/* Score Formula Decomposition Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Score Decomposition Metrics
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-alt)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Hour Score (40% Weight)
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>
                    {(selectedTutorDossier.scores?.hourScore_HS ?? selectedTutorDossier.scores?.annualHourScore_AHS ?? 0).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {selectedTutorDossier.metrics?.totalHours ?? selectedTutorDossier.metrics?.totalAnnualHours ?? 0} hrs completed
                  </div>
                </div>

                <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-alt)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Rating Score (60% Weight)
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>
                    {(selectedTutorDossier.scores?.ratingScore_RS ?? selectedTutorDossier.scores?.averageMonthlyScore_AMS ?? 0).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {selectedTutorDossier.metrics?.averageRating || 5.0}★ ({selectedTutorDossier.metrics?.totalFeedbacks || 0} reviews)
                  </div>
                </div>
              </div>
            </div>

            {/* Tutoring Impact Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '1rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Delivered Classes</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {selectedTutorDossier.metrics?.totalSessions ?? selectedTutorDossier.metrics?.totalAnnualSessions ?? 0}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Hours</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--secondary-dark)' }}>
                  {selectedTutorDossier.metrics?.totalHours ?? selectedTutorDossier.metrics?.totalAnnualHours ?? 0} hrs
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quality Index</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#D97706' }}>
                  {selectedTutorDossier.metrics?.averageRating || 5.0}★
                </div>
              </div>
            </div>

            {/* Footer Close Button */}
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setSelectedTutorDossier(null)}
                className="btn btn-primary btn-sm"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
