import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MessageCircle, Heart, Share2, Send, MoreHorizontal } from 'lucide-react'
import useSubscription from '../hooks/useSubscription'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Button, Card, Avatar, Badge } from '../components/UI'
import useTrimFitStore from '../store/useTrimFitStore'

const mockPosts = [
  { id: 1, author: 'Sarah K.', avatar: 'S', time: '2h ago', content: 'Just completed my first 5K! TrimFit training plans really work! The gradual progression really helped me build endurance without getting injured. Now I can run 5K in under 30 minutes! 🏃‍♀️', likes: 42, comments: 8, tags: ['First5K', 'Progress'] },
  { id: 2, author: 'Mike D.', avatar: 'M', time: '5h ago', content: 'Day 30 of my fitness journey. Down 5kg and feeling amazing! The nutrition tracking feature has been a game changer for staying accountable. Here\'s to the next 30 days! 💪', likes: 128, comments: 23, tags: ['WeightLoss', 'Milestone'] },
  { id: 3, author: 'Emma R.', avatar: 'E', time: '1d ago', content: 'Smart meal plan suggestion was spot on. Finally hitting my protein goals! The personalized recommendations based on my workout schedule make meal prep so much easier.', likes: 89, comments: 15, tags: ['Nutrition', 'Goals'] },
  { id: 4, author: 'James T.', avatar: 'J', time: '1d ago', content: 'Just hit a new PR on deadlifts! The progressive overload tracking helped me increase my strength by 20% in 3 months. Thank you TrimFit!', likes: 156, comments: 31, tags: ['PR', 'Strength'] },
]

const CommunityPage = () => {
  const navigate = useNavigate()
  const { canAccess } = useSubscription()
  const { user } = useTrimFitStore()
  const [posts, setPosts] = useState(mockPosts)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [commentText, setCommentText] = useState({})

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes - 1 } : p))
      } else {
        newSet.add(postId)
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))
      }
      return newSet
    })
  }

  const handleComment = (postId) => {
    if (!commentText[postId]?.trim()) return
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p))
    setCommentText({ ...commentText, [postId]: '' })
  }

  return (
    <div className="min-h-screen pb-24">
      <PageHeader 
        title="Community" 
        subtitle="Connect with fellow fitness enthusiasts"
      />
      <div className="px-4 mt-4 space-y-4">
        {!canAccess('community') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Users size={24} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-amber-300">Join the Community</p>
                <p className="text-xs text-gray-400 mt-1">Connect with thousands of fitness enthusiasts on the Pro plan</p>
              </div>
            </div>
            <Button onClick={() => navigate('/subscription')} className="w-full mt-4" size="sm">
              Upgrade to Pro
            </Button>
          </motion.div>
        )}

        {posts.map((p, i) => (
          <motion.div 
            key={p.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar fallback={p.avatar} size="md" />
                  <div>
                    <p className="text-sm font-semibold">{p.author}</p>
                    <p className="text-xs text-gray-500">{p.time}</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-300 p-1">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed mb-3">{p.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {p.tags.map((tag, idx) => (
                  <Badge key={idx} variant="primary">#{tag}</Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                <button 
                  onClick={() => handleLike(p.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${likedPosts.has(p.id) ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                >
                  <Heart size={16} fill={likedPosts.has(p.id) ? 'currentColor' : 'none'} />
                  {p.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors">
                  <MessageCircle size={16} />
                  {p.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors ml-auto">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2">
                <Avatar fallback={user.name?.charAt(0) || 'U'} size="sm" />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[p.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [p.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment(p.id)}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-3 py-2 text-sm pr-10 focus:outline-none focus:border-primary"
                  />
                  <button 
                    onClick={() => handleComment(p.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-light"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
export default CommunityPage