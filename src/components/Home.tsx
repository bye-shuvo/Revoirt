const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div id="line1" className="w-1/5 h-px bg-white absolute top-[10%] left-0">
        <div id="subline1" className="w-px h-[35vh] bg-white absolute top-[10%] left-full">
          <div id="subline1.1" className="h-px w-[17vw] bg-white absolute top-full left-full">
          </div>
        </div>
      </div>
      <div id="line4" className="w-px h-[10%] bg-white absolute top-0 right-1/5 rotate-180">
        <div id="subline4" className="h-px w-96 bg-white absolute bottom-full">
          <div id="subline4.1" className="w-px h-70 bg-white absolute bottom-full left-full">
          </div>
        </div>
      </div>
      <h1 className="text-[7rem] font-extrabold font-jetbrains-mono text-violet-500 px-3 border">REVOIRT</h1>
      <div id="line2" className="w-1/5 h-px bg-white absolute bottom-[10%] right-0 rotate-180">
        <div id="subline2" className="w-px h-80 bg-white absolute top-[10%] left-full">
          <div id="subline2.1" className="h-px w-80 bg-white absolute top-full left-full">
          </div>
        </div>
      </div>
      <div id="line3" className="w-px h-[10%] bg-white absolute bottom-0 left-1/5">
        <div id="subline3" className="h-px w-96 bg-white absolute bottom-full">
          <div id="subline3.1" className="w-px h-70 bg-white absolute bottom-full left-full">
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
