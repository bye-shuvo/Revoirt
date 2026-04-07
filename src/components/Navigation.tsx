const Navigation = () => {
  return (
    <nav className="bg-slate-900 h-[6%] w-full flex justify-between items-center px-3">
      <h1 className='font-["Fira Code", monospace] text-2xl font-extrabold text-white' title="Code together , Build Fast">Revoirt</h1>
      <div></div>
      <div className="rounded-2xl py-1 px-2 bg-green-500/80 text-sm inset-1 border-b-2 border-green-500/90">Custom navigation toasts will appear here</div>
      <div className="object-center object-cover h-8 w-8 bg-green-300 rounded-full"></div>
    </nav>
  )
}

export default Navigation
