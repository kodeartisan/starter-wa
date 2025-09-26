// src/features/tools/backup-chat/PageGroupChatBackup.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import React from 'react'
import BackupOptions from './components/BackupOptions'
import BackupProgress from './components/BackupProgress'
import BackupResult from './components/BackupResult'
import { useChatBackup } from './hooks/useChatBackup'

const PageGroupChatBackup: React.FC = () => {
  const backup = useChatBackup()

  const renderContent = () => {
    if (backup.isBackingUp) {
      return (
        <BackupProgress
          progress={backup.progress}
          onCancel={backup.cancelBackup}
        />
      )
    }

    if (backup.backupResult) {
      return (
        <BackupResult
          result={backup.backupResult}
          onDone={backup.clearBackupResult}
        />
      )
    }

    return <BackupOptions backupHook={backup} onStart={backup.startBackup} />
  }

  return <LayoutPage width={700}>{renderContent()}</LayoutPage>
}

export default PageGroupChatBackup
