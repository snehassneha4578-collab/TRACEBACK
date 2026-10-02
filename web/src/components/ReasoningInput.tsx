type Props = {
  prompt: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  feedback: string | null;
  submitLabel?: string;
};

export default function ReasoningInput({ prompt, value, onChange, onSubmit, feedback, submitLabel = "Trace my reasoning" }: Props) {
  return (
    <section className="panel reasoning-card">
      <div className="panel-heading reasoning-heading">
        <div>
          <div className="eyebrow"><span className="step-index">01</span> YOUR DIAGNOSTIC</div>
          <h2>Show me how you think.</h2>
        </div>
        <div className="text-badge"><span className="pulse-ring" /> LIVE TRACE</div>
      </div>
      <p className="challenge-prompt">{prompt}</p>
      <label className="visually-hidden" htmlFor="reasoning">Your engineering reasoning</label>
      <textarea
        id="reasoning"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={'Example format:\n1. I would first check…\n2. I would expect to observe…\n3. If that changes, I would then investigate…\n4. This could affect the amplifier because…'}
        rows={8}
        spellCheck
      />
      <div className="input-hint-row">
        <span><i className="numbered-icon">1.</i> Use numbered steps · 3–6 is a useful guide</span>
        <span className="character-count">{value.trim() ? value.trim().length : 0} chars</span>
      </div>
      {feedback && <div className="input-feedback" role="alert"><span>!</span>{feedback}</div>}
      <div className="reasoning-footer">
        <span className="privacy-note"><span className="lock-icon">◈</span> Your trace stays in this session</span>
        <button className="button button-primary" onClick={onSubmit} type="button">
          {submitLabel}<span className="button-arrow">↗</span>
        </button>
      </div>
    </section>
  );
}
