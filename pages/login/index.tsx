const AdminLogin = () => {
  return (
    <>
      <div className="flex justify-center flex-col flex-1">
        <div className="mx-auto w-full max-w-lg px-6">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            onClick={() => (location.href = '/api/auth/login')}
          >
            Login
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminLogin
