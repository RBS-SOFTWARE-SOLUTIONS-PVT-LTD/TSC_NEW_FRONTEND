import React, { useState, useEffect } from 'react';
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
  RefreshCw
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

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4A72C', '#7A1631', '#E8C866', '#5A1024']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Load Initial Data
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

  const handleMonthlyFilterSubmit = (e) => {
    e.preventDefault();
    fetchMonthlyData(selectedYear, selectedMonth);
  };

  const handleAnnualFilterSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'annual') {
      fetchAnnualData(annualYear);
    } else {
      fetchAwardsData(annualYear);
    }
  };

  // Helper for medal rendering
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#3A2700',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
          }}
        >
          <Crown size={15} /> #1 Gold
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
            color: '#212121',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(189, 189, 189, 0.4)',
          }}
        >
          <Medal size={15} /> #2 Silver
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'linear-gradient(135deg, #E6A15C 0%, #CD7F32 100%)',
            color: '#FFFFFF',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(205, 127, 50, 0.4)',
          }}
        >
          <Medal size={15} /> #3 Bronze
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
          fontSize: '0.85rem',
        }}
      >
        #{rank}
      </span>
    );
  };

  const getAwardBadge = (tier) => {
    switch (tier) {
      case 'Gold':
        return (
          <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            <Crown size={14} style={{ marginRight: '4px' }} /> Gold Tier (≥90)
          </span>
        );
      case 'Silver':
        return (
          <span className="badge badge-info" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            <Medal size={14} style={{ marginRight: '4px' }} /> Silver Tier (≥80)
          </span>
        );
      case 'Bronze':
        return (
          <span className="badge badge-warning" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            <Award size={14} style={{ marginRight: '4px' }} /> Bronze Tier (≥70)
          </span>
        );
      default:
        return (
          <span className="badge" style={{ background: 'var(--bg-surface-alt)', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '4px 10px' }}>
            Participant
          </span>
        );
    }
  };

  const currentScoresList =
    activeTab === 'live'
      ? liveData?.tutorScores || []
      : activeTab === 'monthly'
      ? monthlyData?.tutorScores || []
      : activeTab === 'annual'
      ? annualData?.tutorScores || []
      : awardsData?.tutorAwards || [];

  const filteredScores = currentScoresList.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = currentScoresList.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* =========================================================================
          HERO BANNER: University Peer Tutoring Excellence
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #5A1024 0%, #7A1631 60%, #350812 100%)',
          color: '#FAF9F6',
          borderRadius: 'var(--radius-xl)',
          padding: '2.75rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-maroon)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 85% 20%, rgba(212, 167, 44, 0.22) 0%, transparent 45%),
                              radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 40%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(212, 167, 44, 0.2)',
              border: '1px solid rgba(212, 167, 44, 0.4)',
              color: '#F9E29D',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1rem',
            }}
          >
            <Trophy size={16} /> Official Faculty Peer Tutoring Rankings
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              color: '#FFFFFF',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}
          >
            Tutor Leaderboard & Annual Honors
          </h1>

          <p
            style={{
              color: 'rgba(250, 249, 246, 0.88)',
              fontSize: '1.05rem',
              maxWidth: '680px',
              lineHeight: 1.5,
            }}
          >
            Recognizing dedicated undergraduate peer tutors at the University of Kelaniya.
            Scores are computed from <strong>verified tutoring duration (40%)</strong> and{' '}
            <strong>authentic student feedback (60%)</strong>.
          </p>

          {/* Quick Tab Switcher inside Hero */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              marginTop: '1.75rem',
            }}
          >
            <button
              onClick={() => setActiveTab('live')}
              className={`btn ${activeTab === 'live' ? 'btn-secondary' : 'btn-ghost'}`}
              style={
                activeTab !== 'live'
                  ? { color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }
                  : { fontWeight: 700 }
              }
            >
              <Flame size={16} /> Live Monthly Rankings
            </button>

            <button
              onClick={() => setActiveTab('monthly')}
              className={`btn ${activeTab === 'monthly' ? 'btn-secondary' : 'btn-ghost'}`}
              style={
                activeTab !== 'monthly'
                  ? { color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }
                  : { fontWeight: 700 }
              }
            >
              <Calendar size={16} /> Monthly Archive
            </button>

            <button
              onClick={() => setActiveTab('annual')}
              className={`btn ${activeTab === 'annual' ? 'btn-secondary' : 'btn-ghost'}`}
              style={
                activeTab !== 'annual'
                  ? { color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }
                  : { fontWeight: 700 }
              }
            >
              <TrendingUp size={16} /> Annual Standings
            </button>

            <button
              onClick={() => setActiveTab('awards')}
              className={`btn ${activeTab === 'awards' ? 'btn-secondary' : 'btn-ghost'}`}
              style={
                activeTab !== 'awards'
                  ? { color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }
                  : { fontWeight: 700 }
              }
            >
              <Award size={16} /> Annual Awards Gala
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SPOTLIGHT BANNER: Highest Rated Tutor & Scoring Rules
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
            className="card card-gold-accent"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800,
                flexShrink: 0,
                boxShadow: 'var(--shadow-gold)',
              }}
            >
              <Crown size={30} color="#FFD700" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary-dark)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Sparkles size={14} /> Highest Rated Peer Mentor
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: '0.2rem 0' }}>
                {highestRatedTutor.tutorName || highestRatedTutor.name || 'Top Tutor'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D97706', fontWeight: 700 }}>
                  <Star size={14} fill="#D97706" /> {highestRatedTutor.averageRating?.toFixed(1) || '5.0'} / 10
                </span>
                <span>•</span>
                <span>{highestRatedTutor.totalFeedbacks || 0} Student Reviews</span>
              </div>
            </div>
          </div>
        )}

        {/* Scoring Formula Explainer */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
            <Info size={16} /> Transparent Kelaniya TSC Scoring Formula
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {activeTab === 'annual' || activeTab === 'awards' ? (
              <div>
                <strong>Annual Score (AS)</strong> = (30% × Annual Hour Score) + (70% × Average Monthly Score).
                Tutors earning ≥90 obtain <strong>Gold</strong>, ≥80 <strong>Silver</strong>, ≥70 <strong>Bronze</strong> honors.
              </div>
            ) : (
              <div>
                <strong>Monthly Score (MS)</strong> = (40% × Hour Score) + (60% × Rating Score).
                Hour score is benchmarked against the top teaching hours in the university.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PODIUM SECTION (Top 3 Tutors for Current View)
          ========================================================================= */}
      {topThree.length >= 1 && (
        <section style={{ margin: '0.5rem 0' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} color="var(--secondary-dark)" />
            Top Performers Podium
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              alignItems: 'end',
            }}
          >
            {topThree.map((item, idx) => {
              const rank = item.rank || idx + 1;
              const isFirst = rank === 1;
              const score = item.scores?.monthlyScore_MS || item.scores?.annualScore_AS || item.annualScore_AS || 0;
              const hours = item.metrics?.totalHours || item.metrics?.totalAnnualHours || 0;
              const avgRating = item.metrics?.averageRating || 0;

              return (
                <div
                  key={item.tutorId || idx}
                  className={`card ${isFirst ? 'card-gold-accent' : ''}`}
                  style={{
                    padding: '1.75rem 1.5rem',
                    textAlign: 'center',
                    position: 'relative',
                    border: isFirst ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                    background: isFirst
                      ? 'linear-gradient(180deg, rgba(212, 167, 44, 0.08) 0%, var(--bg-surface) 100%)'
                      : 'var(--bg-surface)',
                    transform: isFirst ? 'translateY(-4px)' : 'none',
                    boxShadow: isFirst ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    {renderRankBadge(rank)}
                  </div>

                  {/* Avatar */}
                  <div
                    style={{
                      width: isFirst ? '76px' : '64px',
                      height: isFirst ? '76px' : '64px',
                      borderRadius: '50%',
                      margin: '0 auto 1rem',
                      background: isFirst
                        ? 'linear-gradient(135deg, #FFD700 0%, #D4A72C 100%)'
                        : rank === 2
                        ? 'linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)'
                        : 'linear-gradient(135deg, #CD7F32 0%, #8D5524 100%)',
                      color: isFirst ? '#3A2700' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isFirst ? '1.8rem' : '1.4rem',
                      fontWeight: 800,
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {item.name ? item.name.charAt(0).toUpperCase() : 'T'}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {item.email || `Tutor ID: ${item.userId}`}
                  </p>

                  {/* Highlight Score */}
                  <div
                    style={{
                      background: 'var(--bg-surface-alt)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {activeTab === 'annual' || activeTab === 'awards' ? 'Annual Score (AS)' : 'Monthly Score (MS)'}
                    </div>
                    <div
                      style={{
                        fontSize: '1.85rem',
                        fontWeight: 900,
                        color: isFirst ? 'var(--secondary-dark)' : 'var(--primary)',
                      }}
                    >
                      {score.toFixed(1)} / 100
                    </div>
                  </div>

                  {/* Sub metrics */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '0.75rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Hours</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{hours} hrs</div>
                    </div>
                    {avgRating > 0 && (
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Rating</div>
                        <div style={{ fontWeight: 700, color: '#D97706', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'center' }}>
                          <Star size={12} fill="#D97706" /> {avgRating}★
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          CONTROLS: Search, Filters, Month/Year Pickers
          ========================================================================= */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
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
            placeholder="Search tutor by name, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Tab Specific Filter Pickers */}
        {activeTab === 'monthly' && (
          <form onSubmit={handleMonthlyFilterSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ width: 'auto' }}
            >
              <option value={1}>January</option>
              <option value={2}>February</option>
              <option value={3}>March</option>
              <option value={4}>April</option>
              <option value={5}>May</option>
              <option value={6}>June</option>
              <option value={7}>July</option>
              <option value={8}>August</option>
              <option value={9}>September</option>
              <option value={10}>October</option>
              <option value={11}>November</option>
              <option value={12}>December</option>
            </select>

            <select
              className="select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ width: 'auto' }}
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary btn-sm">
              <Filter size={14} /> Filter
            </button>
          </form>
        )}

        {(activeTab === 'annual' || activeTab === 'awards') && (
          <form onSubmit={handleAnnualFilterSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              className="select"
              value={annualYear}
              onChange={(e) => setAnnualYear(Number(e.target.value))}
              style={{ width: 'auto' }}
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr}>
                  Academic Year {yr}
                </option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary btn-sm">
              <Filter size={14} /> View Year
            </button>
          </form>
        )}
      </div>

      {/* =========================================================================
          ANNUAL AWARDS SUMMARY CARDS (When on Awards Tab)
          ========================================================================= */}
      {activeTab === 'awards' && awardsData?.awardSummary && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="card card-gold-accent" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: 700, fontSize: '0.85rem' }}>
              <Crown size={18} /> Gold Medalists (≥90)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary-dark)', marginTop: '0.3rem' }}>
              {awardsData.awardSummary.goldCount} Tutors
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #9E9E9E' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#616161', fontWeight: 700, fontSize: '0.85rem' }}>
              <Medal size={18} /> Silver Medalists (≥80)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#424242', marginTop: '0.3rem' }}>
              {awardsData.awardSummary.silverCount} Tutors
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #CD7F32' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A0522D', fontWeight: 700, fontSize: '0.85rem' }}>
              <Award size={18} /> Bronze Medalists (≥70)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8D5524', marginTop: '0.3rem' }}>
              {awardsData.awardSummary.bronzeCount} Tutors
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Users size={18} /> Total Evaluated
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.3rem' }}>
              {awardsData.awardSummary.totalTutors}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN TABLE / LEADERBOARD LIST
          ========================================================================= */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Calculating verified scores and university ranks...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--error)' }}>
            <p>{error}</p>
            <button onClick={fetchLiveData} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : filteredScores.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Trophy size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3>No Tutor Standings Found</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              No completed sessions or scores recorded for the selected criteria.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-alt)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.25rem', width: '100px' }}>Rank</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Peer Tutor</th>
                  {activeTab !== 'awards' && (
                    <>
                      <th style={{ padding: '1rem 1.25rem' }}>Teaching Hours</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Rating (out of 5★)</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Hour Score (HS)</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Rating Score (RS)</th>
                    </>
                  )}
                  {activeTab === 'awards' && (
                    <th style={{ padding: '1rem 1.25rem' }}>Award Honors</th>
                  )}
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {activeTab === 'annual' || activeTab === 'awards' ? 'Annual Score (AS)' : 'Monthly Score (MS)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.map((tutor, idx) => {
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
                      style={{
                        borderBottom: '1px solid var(--border-light)',
                        backgroundColor: rank <= 3 ? 'rgba(212, 167, 44, 0.03)' : 'transparent',
                        transition: 'background-color var(--transition-fast)',
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
                              fontWeight: 700,
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

                      {/* Detailed metrics (non-awards view) */}
                      {activeTab !== 'awards' && (
                        <>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                              <Clock size={15} color="var(--secondary-dark)" /> {hours} hrs
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {tutor.metrics?.totalSessions || tutor.metrics?.totalAnnualSessions || 0} classes
                            </div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: '#D97706' }}>
                              <Star size={14} fill="#D97706" /> {rating > 0 ? rating.toFixed(1) : '5.0'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {tutor.metrics?.totalFeedbacks || 0} reviews
                            </div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span className="badge badge-info" style={{ fontWeight: 600 }}>
                              {hs.toFixed(1)} / 100
                            </span>
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span className="badge badge-gold" style={{ fontWeight: 600 }}>
                              {rs.toFixed(1)} / 100
                            </span>
                          </td>
                        </>
                      )}

                      {/* Award Badge (Awards tab) */}
                      {activeTab === 'awards' && (
                        <td style={{ padding: '1rem 1.25rem' }}>{getAwardBadge(award)}</td>
                      )}

                      {/* Total Score */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: rank === 1 ? 'var(--secondary-dark)' : 'var(--primary)',
                          }}
                        >
                          {score.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>points</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
