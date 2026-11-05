import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { registerAccount, loginAccount, logoutAccount, currentSession } from './auth.js';
import './style.css';

function Field({ id, label, type = 'text', value, onChange, autoComplete, maxLength }) {
  return <label className="field" htmlFor={id}><span>{label}</span><input id={id} data-testid={id} type={type} value={value} onChange={event => onChange(event.target.value)} autoComplete={autoComplete} maxLength={maxLength} required /></label>;
}
function Register({ onRegistered }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    setError(''); setBusy(true);
    try { const profile = await registerAccount({ fullName, email, password, confirmPassword }); onRegistered(profile); }
    catch (failure) { setError(failure.message || 'Không thể đăng ký. Vui lòng thử lại.'); }
    finally { setBusy(false); }
  }
  return <section data-testid="register-page"><p className="eyebrow">GIEO MỘT KHỞI ĐẦU</p><h1>Tạo tài khoản</h1><p className="subtitle">Một góc nhỏ dành cho hành trình của bạn.</p><form noValidate onSubmit={submit}>
    <Field id="register-name" label="Họ và tên" value={fullName} onChange={setFullName} autoComplete="name" maxLength={80} />
    <Field id="register-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
    <Field id="register-password" label="Mật khẩu" type="password" value={password} onChange={setPassword} autoComplete="new-password" maxLength={64} />
    <p className="hint">Từ 8 đến 64 ký tự.</p>
    <Field id="register-confirm" label="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" maxLength={64} />
    {error && <p role="alert" data-testid="register-error">{error}</p>}
    <button className="primary" data-testid="register-submit" disabled={busy}>{busy ? 'Đang tạo tài khoản…' : 'Đăng ký'}</button>
  </form><p className="switch">Đã có tài khoản? <a href="#login">Đăng nhập</a></p></section>;
}
function Login({ onLogin, initialEmail, notice }) {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    setError(''); setBusy(true);
    try { onLogin(await loginAccount({ email, password })); }
    catch (failure) { setError(failure.message || 'Không thể đăng nhập.'); }
    finally { setBusy(false); }
  }
  return <section data-testid="login-page"><p className="eyebrow">THẬT VUI KHI GẶP LẠI BẠN</p><h1>Đăng nhập</h1><p className="subtitle">Tiếp tục từ nơi bạn đã dừng lại.</p>
    {notice && <p className="notice" role="status" data-testid="auth-notice">{notice}</p>}
    <form noValidate onSubmit={submit}>
      <Field id="login-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="username" />
      <Field id="login-password" label="Mật khẩu" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
      {error && <p role="alert" data-testid="login-error">{error}</p>}
      <button className="primary" data-testid="login-submit" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
    </form><p className="switch">Chưa có tài khoản? <a href="#register">Đăng ký ngay</a></p></section>;
}
function Dashboard({ profile, onLogout }) {
  return <section data-testid="dashboard-page"><span className="success-icon" aria-hidden="true">✓</span><p className="eyebrow">ĐĂNG NHẬP THÀNH CÔNG</p><h1>Xin chào, {profile.fullName}!</h1><p className="subtitle">Bạn đã vào trang cá nhân của mình.</p><dl className="profile"><dt>Họ tên</dt><dd data-testid="profile-name">{profile.fullName}</dd><dt>Email</dt><dd data-testid="profile-email">{profile.email}</dd><dt>Trạng thái</dt><dd><span className="badge">Đã đăng nhập</span></dd></dl><button className="primary" data-testid="logout" onClick={onLogout}>Đăng xuất</button></section>;
}
function App() {
  const [route, setRoute] = useState(location.hash || '#login');
  const [profile, setProfile] = useState(currentSession);
  const [notice, setNotice] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  useEffect(() => { const changed = () => setRoute(location.hash || '#login'); addEventListener('hashchange', changed); return () => removeEventListener('hashchange', changed); }, []);
  useEffect(() => {
    if (route === '#dashboard' && !profile) location.hash = 'login';
    if (profile && route !== '#dashboard') location.hash = 'dashboard';
  }, [route, profile]);
  function registered(user) { setRegisteredEmail(user.email); setNotice('Đăng ký thành công. Vui lòng đăng nhập.'); location.hash = 'login'; }
  function login(user) { setProfile(user); setNotice(''); location.hash = 'dashboard'; }
  function logout() { logoutAccount(); setProfile(null); setNotice('Bạn đã đăng xuất.'); location.hash = 'login'; }
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href={profile ? '#dashboard' : '#login'}><span className="brand-mark" aria-hidden="true">m.</span><span>mộc<span className="brand-light">space</span></span></a><span className="course">Không gian của bạn <span aria-hidden="true">↗</span></span></header>
    <main className="portal">
      <aside className="story" aria-label="Giới thiệu Mộc Space">
        <span className="edition">A LITTLE SPACE TO GROW · 01</span>
        <div className="story-copy"><p className="eyebrow">CHẬM MỘT NHỊP. TIẾN MỘT BƯỚC.</p><h2>Những điều lớn,<br />từ khởi đầu <em>nhỏ.</em></h2><p>Một không gian riêng để kết nối, khám phá và bắt đầu hành trình của bạn.</p></div>
        <div className="garden" aria-hidden="true"><div className="sun"></div><div className="arch arch-back"></div><div className="arch arch-front"></div><span className="garden-caption">MAKE ROOM<br />FOR YOURSELF.</span><span className="garden-star">✳</span></div>
        <div className="story-foot"><span className="live-dot"></span> Một khởi đầu mới đang chờ bạn.</div>
      </aside>
      <article className="form-panel">
        {!profile && <nav className="auth-tabs" aria-label="Tài khoản"><a href="#login" aria-current={route !== '#register' ? 'page' : undefined}>Đăng nhập</a><a href="#register" aria-current={route === '#register' ? 'page' : undefined}>Đăng ký</a></nav>}
        <div className="form-content">{profile ? <Dashboard profile={profile} onLogout={logout} /> : route === '#register' ? <Register onRegistered={registered} /> : <Login onLogin={login} initialEmail={registeredEmail} notice={notice} />}</div>
        <p className="form-foot"><span aria-hidden="true">◇</span> Không gian nhỏ. Trải nghiệm dành riêng cho bạn.</p>
      </article>
    </main>
    <footer><span>© {new Date().getFullYear()} Mộc Space</span><span>Thực hành React · FER202</span></footer>
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
