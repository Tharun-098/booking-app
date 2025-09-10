import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="auth-footer border-1 border-gray-400 p-4 text-center">
        <p className="text-sm text-gray-400 mt-3">© 2025 BookEasy. All rights reserved.</p>
        <div className="footer-links text-blue-400 text-sm my-3">
          <a href="#privacy" className="px-3 hover:underline">Privacy Policy</a>
          <a href="#terms" className="px-3 hover:underline">Terms of Service</a>
          <a href="#help" className="px-3 hover:underline">Help Center</a>
        </div>
      </footer>
    </div>
  )
}

export default Footer
