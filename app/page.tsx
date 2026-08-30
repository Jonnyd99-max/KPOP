'use client';

import { useMemo, useState } from 'react';

const groups = [
  { name: 'BLACKPINK', fandom: 'BLINK', agency: 'YG Entertainment', debut: '2016', members: ['Jisoo', 'Jennie', 'Rosé', 'Lisa'], color: '#ff4fa3', initials: 'BP', status: 'World tour' },
  { name: 'Stray Kids', fandom: 'STAY', agency: 'JYP Entertainment', debut: '2018', members: ['Bang Chan', 'Lee Know', 'Changbin', 'Hyunjin', 'Han', 'Felix', 'Seungmin', 'I.N'], color: '#ff553e', initials: 'SK', status: 'On tour' },
  { name: 'aespa', fandom: 'MY', agency: 'SM Entertainment', debut: '2020', members: ['Karina', 'Giselle', 'Winter', 'Ningning'], color: '#7357ff', initials: 'AE', status: 'New music' },
  { name: 'SEVENTEEN', fandom: 'CARAT', agency: 'Pledis Entertainment', debut: '2015', members: ['S.Coups', 'Jeonghan', 'Joshua', 'Jun', 'Hoshi', 'Wonwoo', 'Woozi', 'DK', 'Mingyu', 'The8', 'Seungkwan', 'Vernon', 'Dino'], color: '#45b8e8', initials: 'SVT', status: 'Fan meeting' },
  { name: 'ILLIT', fandom: 'GLLIT', agency: 'Belift Lab', debut: '2024', members: ['Yunah', 'Minju', 'Moka', 'Wonhee', 'Iroha'], color: '#b77cff', initials: 'IL', status: 'Rising' },
  { name: 'ENHYPEN', fandom: 'ENGENE', agency: 'Belift Lab', debut: '2020', members: ['Jungwon', 'Heeseung', 'Jay', 'Jake', 'Sunghoon', 'Sunoo', 'Ni-ki'], color: '#14b89a', initials: 'EN', status: 'On tour' },
];

const stories = [
  { tag: 'COMEBACK WATCH', title: 'The releases everyone is talking about this week', text: 'A quick, source-led roundup of teasers, track lists and confirmed release dates.', time: '18 min ago', tone: 'pink' },
  { tag: 'FASHION', title: 'Airport style: the looks lighting up fan feeds', text: 'The standout fits, brand moments and fan-favourite details from recent schedules.', time: '1 hr ago', tone: 'purple' },
  { tag: 'BUZZ', title: 'Five moments moving fastest across the fandom', text: 'A calm catch-up on the clips and conversations gaining traction today.', time: '3 hrs ago', tone: 'blue' },
];

const tours = [
  { day: '04', month: 'SEP', artist: 'Stray Kids', city: 'Paris', venue: 'Stade de France', flag: '🇫🇷' },
  { day: '11', month: 'SEP', artist: 'BLACKPINK', city: 'London', venue: 'Wembley Stadium', flag: '🇬🇧' },
  { day: '19', month: 'SEP', artist: 'ENHYPEN', city: 'Berlin', venue: 'Uber Arena', flag: '🇩🇪' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('Discover');
  const [saved, setSaved] = useState<string[]>([]);
  const filtered = useMemo(() => groups.filter((g) => `${g.name} ${g.members.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return <main>
    <nav className="nav">
      <a className="brand" href="#top" aria-label="KPOP home"><span>K</span>POP<span className="brand-dot">•</span></a>
      <div className="navlinks">{['Discover', 'Artists', 'Buzz', 'Tours'].map((item) => <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}>{item}</button>)}</div>
      <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search artists or members" /></label>
      <button className="profile" aria-label="Open profile">JK</button>
    </nav>

    <section className="hero" id="top">
      <div className="eyebrow"><span className="live-dot" /> YOUR DAILY K-POP PULSE</div>
      <h1>Everything K-POP.<br/><em>One beat ahead.</em></h1>
      <p>Meet the artists, know every member, catch the latest buzz and never miss a show.</p>
      <div className="hero-actions"><a href="#artists" className="primary">Explore artists <span>↗</span></a><a href="#tours" className="secondary">View tour calendar</a></div>
      <div className="orbit orbit-one">♪</div><div className="orbit orbit-two">✦</div><div className="orbit orbit-three">♡</div>
    </section>

    <section className="ticker"><b>TRENDING NOW</b><span>BLACKPINK world tour</span><i>•</i><span>Stray Kids comeback</span><i>•</i><span>aespa new era</span><i>•</i><span>SEVENTEEN fan meeting</span></section>

    <section className="section artists" id="artists">
      <div className="section-head"><div><div className="kicker">MEET THE SCENE</div><h2>Artists to know</h2></div><span>{filtered.length} profiles</span></div>
      <div className="artist-grid">{filtered.map((group, index) => <article className="artist-card" key={group.name} style={{'--accent': group.color} as React.CSSProperties}>
        <div className="portrait"><span className="monogram">{group.initials}</span><span className="status">{group.status}</span><button className={saved.includes(group.name) ? 'heart saved' : 'heart'} onClick={() => setSaved((s) => s.includes(group.name) ? s.filter(x => x !== group.name) : [...s, group.name])} aria-label={`Save ${group.name}`}>♥</button><span className="number">0{index + 1}</span></div>
        <div className="card-body"><h3>{group.name}</h3><p>{group.agency} · Debut {group.debut}</p><div className="members">{group.members.slice(0, 5).map(m => <span key={m}>{m}</span>)}{group.members.length > 5 && <span>+{group.members.length - 5}</span>}</div><div className="card-foot"><span>Fandom: <b>{group.fandom}</b></span><button>Fact file →</button></div></div>
      </article>)}</div>
      {!filtered.length && <div className="empty">No match yet — try an artist or member name.</div>}
    </section>

    <section className="buzz section" id="buzz">
      <div className="section-head light"><div><div className="kicker">FRESH FROM THE FEED</div><h2>Latest buzz</h2></div><button>See all stories →</button></div>
      <div className="story-grid">{stories.map((story, i) => <article className={`story ${story.tone}`} key={story.title}><div className="story-art"><span>{i === 0 ? 'K!' : i === 1 ? '✦' : '♫'}</span></div><div><small>{story.tag}</small><h3>{story.title}</h3><p>{story.text}</p><time>{story.time}</time></div></article>)}</div>
      <p className="editorial-note">Buzz stories are clearly labelled and designed for links to verified sources—not anonymous rumours.</p>
    </section>

    <section className="section tour" id="tours">
      <div className="section-head"><div><div className="kicker">PACK YOUR LIGHTSTICK</div><h2>On tour next</h2></div><button className="calendar-btn">Full calendar ↗</button></div>
      <div className="tour-list">{tours.map(t => <article key={t.artist}><div className="date"><b>{t.day}</b><span>{t.month}</span></div><div className="tour-artist"><span className="mini-avatar">{t.artist.slice(0,2).toUpperCase()}</span><div><h3>{t.artist}</h3><p>{t.venue}</p></div></div><div className="city"><span>{t.flag}</span><div><b>{t.city}</b><small>Doors 18:30</small></div></div><button>Tickets ↗</button></article>)}</div>
    </section>

    <footer><a className="brand" href="#top"><span>K</span>POP<span className="brand-dot">•</span></a><p>Your fandom, beautifully organised.</p><span>Prototype data · Verify dates with official organisers</span></footer>
  </main>;
}

