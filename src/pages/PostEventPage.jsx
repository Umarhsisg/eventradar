import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, ImagePlus, FileImage, X } from 'lucide-react';
import MapPicker from '../components/MapPicker';
import { EVENT_TYPES, DISTRICTS } from '../lib/mockData';

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  backgroundColor: '#0f0f14',
  border: '1px solid #2a2a4a',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.15s',
};

function Field({ label, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 600 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>{hint}</p>}
    </div>
  );
}

function ImageUpload({ label, hint, icon: Icon, file, onFile, accept = 'image/*' }) {
  const ref = useRef();
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 600 }}>{label}</label>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }} onChange={e => onFile(e.target.files[0] || null)} />
      {file ? (
        <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #2a2a4a' }}>
          <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
          <button
            type="button"
            onClick={() => { onFile(null); ref.current.value = ''; }}
            style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
          >
            <X size={14} />
          </button>
          <div style={{ padding: '8px 12px', backgroundColor: '#0f0f14', fontSize: '0.78rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current.click()}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
            padding: '24px', backgroundColor: '#0f0f14', border: '2px dashed #2a2a4a',
            borderRadius: '10px', cursor: 'pointer', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#4f8ef7'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a4a'}
        >
          <Icon size={28} style={{ color: '#4f8ef7' }} />
          <div>
            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem' }}>Click to upload</div>
            {hint && <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>{hint}</div>}
          </div>
        </button>
      )}
    </div>
  );
}

const INITIAL = {
  title: '', type: '', district: '', date: '', endDate: '',
  college: '', organizer: '', venue: '', description: '',
  registrationLink: '', registrationDeadline: '', teamSize: '',
  prize: '', tags: '', maxSlots: '',
};

export default function PostEventPage({ user, addEvent }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [imageFile, setImageFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [mapLocation, setMapLocation] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.type) errs.type = 'Event type is required';
    if (!form.district) errs.district = 'District is required';
    if (!form.date) errs.date = 'Start date is required';
    if (!form.college.trim()) errs.college = 'College name is required';
    if (!form.venue.trim()) errs.venue = 'Venue is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.registrationLink.trim()) errs.registrationLink = 'Registration link is required';
    if (!form.registrationDeadline) errs.registrationDeadline = 'Deadline is required';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await addEvent({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        maxSlots: form.maxSlots ? parseInt(form.maxSlots, 10) : null,
        imageFile,
        posterFile,
        latitude: mapLocation?.lat ?? null,
        longitude: mapLocation?.lng ?? null,
        locationAddress: mapLocation?.address ?? null,
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to submit event. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  const onFocus = e => e.target.style.borderColor = '#4f8ef7';
  const onBlur = (key) => e => e.target.style.borderColor = errors[key] ? '#ef4444' : '#2a2a4a';
  const errBorder = (key) => ({ ...inputStyle, borderColor: errors[key] ? '#ef4444' : '#2a2a4a' });

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <div style={{ width: 72, height: 72, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={36} style={{ color: '#10b981' }} />
          </div>
          <h2 style={{ color: '#e2e8f0', margin: '0 0 12px', fontSize: '1.6rem', fontWeight: 800 }}>Event Submitted!</h2>
          <p style={{ color: '#94a3b8', margin: '0 0 32px', lineHeight: 1.6 }}>
            Your event has been submitted for review. Admins will approve it shortly.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => { setForm(INITIAL); setImageFile(null); setPosterFile(null); setSubmitted(false); }} style={{ padding: '11px 20px', border: '1px solid #2a2a4a', borderRadius: '10px', color: '#94a3b8', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 500 }}>
              Submit Another
            </button>
            <button onClick={() => navigate('/')} style={{ padding: '11px 20px', backgroundColor: '#4f8ef7', borderRadius: '10px', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              View Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sectionHead = (label) => (
    <h3 style={{ margin: '0 0 4px', color: '#4f8ef7', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</h3>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', padding: '32px 24px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: 36, height: 36, backgroundColor: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={18} style={{ color: '#4f8ef7' }} />
            </div>
            <h1 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.75rem', fontWeight: 800 }}>Post an Event</h1>
          </div>
          <p style={{ margin: 0, color: '#94a3b8' }}>Fill in the details below. Events are reviewed before going live.</p>
        </div>

        {!user && (
          <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
              You need to <a href="/login" style={{ color: '#f59e0b', fontWeight: 700 }}>log in</a> to post an event.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Basic Info */}
          <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {sectionHead('Basic Info')}
            <Field label="Event Title" required>
              <input style={errBorder('title')} placeholder="e.g. CodeStorm Hackathon 2025" value={form.title} onChange={e => set('title', e.target.value)} onFocus={onFocus} onBlur={onBlur('title')} />
              {errors.title && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.title}</span>}
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Event Type" required>
                <select style={{ ...errBorder('type'), appearance: 'none' }} value={form.type} onChange={e => set('type', e.target.value)} onFocus={onFocus} onBlur={onBlur('type')}>
                  <option value="">Select type</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.type}</span>}
              </Field>
              <Field label="District" required>
                <select style={{ ...errBorder('district'), appearance: 'none' }} value={form.district} onChange={e => set('district', e.target.value)} onFocus={onFocus} onBlur={onBlur('district')}>
                  <option value="">Select district</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.district && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.district}</span>}
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Start Date" required>
                <input type="date" style={{ ...errBorder('date'), colorScheme: 'dark' }} value={form.date} onChange={e => set('date', e.target.value)} onFocus={onFocus} onBlur={onBlur('date')} />
                {errors.date && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.date}</span>}
              </Field>
              <Field label="End Date">
                <input type="date" style={{ ...inputStyle, colorScheme: 'dark' }} value={form.endDate} onChange={e => set('endDate', e.target.value)} onFocus={onFocus} onBlur={e => e.target.style.borderColor = '#2a2a4a'} />
              </Field>
            </div>
          </div>

          {/* Location & Organizer */}
          <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {sectionHead('Location & Organizer')}
            <Field label="College / Institute" required>
              <input style={errBorder('college')} placeholder="e.g. MIT WPU, Pune" value={form.college} onChange={e => set('college', e.target.value)} onFocus={onFocus} onBlur={onBlur('college')} />
              {errors.college && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.college}</span>}
            </Field>
            <Field label="Organizer / Club">
              <input style={inputStyle} placeholder="e.g. CSE Department, CodeClub" value={form.organizer} onChange={e => set('organizer', e.target.value)} onFocus={onFocus} onBlur={e => e.target.style.borderColor = '#2a2a4a'} />
            </Field>
            <Field label="Venue" required>
              <input style={errBorder('venue')} placeholder="e.g. Main Auditorium, MIT WPU Campus" value={form.venue} onChange={e => set('venue', e.target.value)} onFocus={onFocus} onBlur={onBlur('venue')} />
              {errors.venue && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.venue}</span>}
            </Field>
            <Field label="Event Location on Map" hint="Optional — helps attendees find the venue">
              <MapPicker value={mapLocation} onChange={setMapLocation} />
            </Field>
          </div>

          {/* Media */}
          <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {sectionHead('Media')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ImageUpload
                label="Event / College Photo"
                hint="JPG, PNG, WEBP — shown on card"
                icon={ImagePlus}
                file={imageFile}
                onFile={setImageFile}
              />
              <ImageUpload
                label="Invitation Poster"
                hint="JPG, PNG, PDF poster"
                icon={FileImage}
                file={posterFile}
                onFile={setPosterFile}
                accept="image/*,.pdf"
              />
            </div>
          </div>

          {/* Details */}
          <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {sectionHead('Details')}
            <Field label="Description" required>
              <textarea style={{ ...errBorder('description'), minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }} placeholder="Describe the event — what it's about, who can participate..." value={form.description} onChange={e => set('description', e.target.value)} onFocus={onFocus} onBlur={onBlur('description')} />
              {errors.description && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.description}</span>}
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <Field label="Team Size">
                <input style={inputStyle} placeholder="e.g. 2-4, Individual" value={form.teamSize} onChange={e => set('teamSize', e.target.value)} onFocus={onFocus} onBlur={e => e.target.style.borderColor = '#2a2a4a'} />
              </Field>
              <Field label="Max Participants / Slots" hint="Leave blank for unlimited">
                <input
                  type="number"
                  min="1"
                  style={inputStyle}
                  placeholder="e.g. 200"
                  value={form.maxSlots}
                  onChange={e => set('maxSlots', e.target.value)}
                  onFocus={onFocus}
                  onBlur={e => e.target.style.borderColor = '#2a2a4a'}
                />
              </Field>
              <Field label="Prize / Reward">
                <input style={inputStyle} placeholder="e.g. ₹50,000, Certificate" value={form.prize} onChange={e => set('prize', e.target.value)} onFocus={onFocus} onBlur={e => e.target.style.borderColor = '#2a2a4a'} />
              </Field>
            </div>
            <Field label="Tags" hint="Comma-separated: e.g. AI, Web Dev, IoT">
              <input style={inputStyle} placeholder="AI, Web Dev, IoT" value={form.tags} onChange={e => set('tags', e.target.value)} onFocus={onFocus} onBlur={e => e.target.style.borderColor = '#2a2a4a'} />
            </Field>
          </div>

          {/* Registration */}
          <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {sectionHead('Registration')}
            <Field label="Registration Link" required>
              <input type="url" style={errBorder('registrationLink')} placeholder="https://your-form-link.com" value={form.registrationLink} onChange={e => set('registrationLink', e.target.value)} onFocus={onFocus} onBlur={onBlur('registrationLink')} />
              {errors.registrationLink && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.registrationLink}</span>}
            </Field>
            <Field label="Registration Deadline" required>
              <input type="date" style={{ ...errBorder('registrationDeadline'), colorScheme: 'dark' }} value={form.registrationDeadline} onChange={e => set('registrationDeadline', e.target.value)} onFocus={onFocus} onBlur={onBlur('registrationDeadline')} />
              {errors.registrationDeadline && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.registrationDeadline}</span>}
            </Field>
          </div>

          {errors.submit && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#ef4444', fontSize: '0.88rem' }}>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '14px', backgroundColor: submitting ? '#3a6bc7' : '#4f8ef7', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background-color 0.15s' }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#6ba3ff'; }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#4f8ef7'; }}
          >
            {submitting ? 'Uploading & Submitting...' : 'Submit for Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
