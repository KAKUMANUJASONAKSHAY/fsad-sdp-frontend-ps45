import { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'

function AchievementFilesList({ achievementId }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/files/achievement/${achievementId}`)
        setFiles(response.data || [])
      } catch {
        setFiles([])
      } finally {
        setLoading(false)
      }
    }

    if (achievementId) {
      fetchFiles()
    } else {
      setLoading(false)
      setFiles([])
    }
  }, [achievementId])

  if (loading) {
    return <span className="inline-meta">Loading files...</span>
  }

  if (!files.length) {
    return <span className="inline-meta">No uploaded files</span>
  }

  return (
    <div className="file-list">
      {files.map((file) => (
        <a
          key={file.id}
          className="file-chip"
          href={`${import.meta.env.VITE_API_URL}/files/download/${file.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {file.fileName || `File ${file.id}`}
        </a>
      ))}
    </div>
  )
}

export default AchievementFilesList
