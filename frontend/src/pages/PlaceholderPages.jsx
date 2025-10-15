import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bidAPI, projectAPI, messageAPI, contractAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

// Project Detail with bids
const ProjectDetail = () => {
  const { id } = useParams();
  const { isFreelancer, user } = useAuth();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingBid, setPlacingBid] = useState(false);
  const [bidForm, setBidForm] = useState({ amount: '', proposal: '', deliveryTime: '1-to-2-weeks' });

  const durationLabels = {
    'less-than-1-week': 'Less than 1 week',
    '1-to-2-weeks': '1 to 2 weeks',
    '2-to-4-weeks': '2 to 4 weeks',
    '1-to-2-months': '1 to 2 months',
    'more-than-2-months': 'More than 2 months'
  };

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const [projectRes, bidsRes] = await Promise.all([
        projectAPI.getById(id),
        bidAPI.getByProject(id)
      ]);
      setProject(projectRes.data);
      setBids(bidsRes.data);
    } finally {
      setLoading(false);
    }
  };

  const submitBid = async (e) => {
    e.preventDefault();
    setPlacingBid(true);
    try {
      const res = await bidAPI.create({ project: id, ...bidForm, amount: Number(bidForm.amount) });
      setBids(prev => [res.data.bid, ...prev]);
      setBidForm({ amount: '', proposal: '', deliveryTime: '1-to-2-weeks' });
    } finally {
      setPlacingBid(false);
    }
  };

  const acceptBid = async (bidId) => {
    await bidAPI.accept(bidId);
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!project) return null;

  const canAccept = user?.id === project.client?._id;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            project.status === 'open' ? 'bg-green-100 text-green-800' :
            project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Budget</div>
            <div className="font-semibold">${project.budget} {project.budgetType}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-semibold">{durationLabels[project.duration]}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Category</div>
            <div className="font-semibold">{project.category}</div>
          </div>
        </div>
      </div>

      {isFreelancer && project.status === 'open' && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Place a Bid</h2>
          <form onSubmit={submitBid} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
              <input type="number" className="input" value={bidForm.amount} onChange={e => setBidForm({ ...bidForm, amount: e.target.value })} min="0" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
              <select className="input" value={bidForm.deliveryTime} onChange={e => setBidForm({ ...bidForm, deliveryTime: e.target.value })}>
                {Object.keys(durationLabels).map(key => (
                  <option key={key} value={key}>{durationLabels[key]}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Proposal</label>
              <textarea className="input" rows={3} value={bidForm.proposal} onChange={e => setBidForm({ ...bidForm, proposal: e.target.value })} required />
            </div>
            <div className="md:col-span-3">
              <button className="btn btn-primary" disabled={placingBid}>{placingBid ? 'Placing...' : 'Submit Bid'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bids ({bids.length})</h2>
        </div>
        <div className="mt-4 space-y-4">
          {bids.length === 0 && <p className="text-gray-500">No bids yet.</p>}
          {bids.map((bid) => (
            <div key={bid._id} className="border rounded p-4 flex items-start justify-between">
              <div>
                <div className="font-medium">{bid.freelancer?.username}</div>
                <div className="text-gray-700 mt-1">{bid.proposal}</div>
                <div className="text-sm text-gray-500 mt-2">${bid.amount} • {durationLabels[bid.deliveryTime]}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{bid.status}</span>
                {user?.id === project.client?._id && bid.status === 'pending' && (
                  <button className="btn btn-outline" onClick={() => acceptBid(bid._id)}>Accept</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState('');
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  const load = async () => {
    if (!projectId) return;
    const res = await messageAPI.getByProject(projectId);
    setMessages(res.data);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!projectId || !content) return;
    await messageAPI.send({ project: projectId, content });
    setContent('');
    await load();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
      <div className="card">
        <form onSubmit={send} className="space-y-4">
          <input className="input" placeholder="Enter Project ID" value={projectId} onChange={e => setProjectId(e.target.value)} />
          <div className="border rounded p-3 h-64 overflow-auto bg-gray-50">
            {messages.map(m => (
              <div key={m._id} className={`mb-2 ${m.sender?._id === user?.id ? 'text-right' : ''}`}>
                <div className="inline-block px-3 py-2 rounded bg-white border">
                  <div className="text-xs text-gray-500">{m.sender?.username}</div>
                  <div>{m.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input className="input flex-1" placeholder="Type a message" value={content} onChange={e => setContent(e.target.value)} />
            <button className="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Contracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);

  useEffect(() => { load(); }, [user]);

  const load = async () => {
    if (!user) return;
    const res = await contractAPI.getUserContracts(user.id);
    setContracts(res.data);
  };

  const updateMilestone = async (contractId, milestoneId, status) => {
    await contractAPI.updateMilestone(contractId, milestoneId, status);
    await load();
  };

  const completeContract = async (contractId) => {
    await contractAPI.complete(contractId);
    await load();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contracts</h1>
      <div className="space-y-4">
        {contracts.map(c => (
          <div key={c._id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.project?.title}</div>
                <div className="text-sm text-gray-600">${c.amount}</div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                c.status === 'active' ? 'bg-green-100 text-green-800' :
                c.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {c.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {c.milestones?.map(m => (
                <div key={m._id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-sm text-gray-600">${m.amount}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      m.status === 'paid' ? 'bg-green-100 text-green-800' :
                      m.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>{m.status}</span>
                    {m.status === 'pending' && (
                      <button className="btn btn-outline" onClick={() => updateMilestone(c._id, m._id, 'completed')}>Mark Completed</button>
                    )}
                  </div>
                </div>
              ))}
              {c.status === 'active' && user?.id === c.client?._id && (
                <div className="pt-2">
                  <button className="btn btn-primary" onClick={() => completeContract(c._id)}>Mark Contract Complete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', bio: '', hourlyRate: '' });

  useEffect(() => {
    if (user?.profile) {
      const { firstName = '', lastName = '', bio = '', hourlyRate = '' } = user.profile;
      setForm({ firstName, lastName, bio, hourlyRate });
    }
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    await updateProfile(form);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      <div className="card">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input className="input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input className="input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea className="input" rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (USD)</label>
            <input type="number" className="input" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <button className="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { ProjectDetail, Messages, Contracts, Profile };



