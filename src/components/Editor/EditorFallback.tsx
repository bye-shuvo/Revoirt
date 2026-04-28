const shortcuts =
    [
        { name: "open terminal", command: "ctrl + `" },
        { name: "create new file", command: "ctrl + f" },

    ]

const EditorFallback = () => {
    return (
        <div className="h-full bg-inherit flex justify-center items-center flex-col gap-5 text-white font-jetbrains-mono no-scrollbar overflow-hidden">
            <h1 className="text-lg">
                <p className='text-xl text-purple-500'>Welcome</p>
                <p className='text-xl text-purple-500'>To</p>
                <p className='font-saira-stencil-one font-extrabold text-[11rem] leading-38 text-zinc-700'>Revoirt</p>
                <p className='text-xl text-amber-300 text-end'><svg className='h-9 w-9 rotate-90 mx-2 inline' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M160 512C142.3 512 128 526.3 128 544C128 561.7 142.3 576 160 576L256 576C309 576 352 533 352 480L352 173.3L425.4 246.7C437.9 259.2 458.2 259.2 470.7 246.7C483.2 234.2 483.2 213.9 470.7 201.4L342.7 73.4C330.2 60.9 309.9 60.9 297.4 73.4L169.4 201.4C156.9 213.9 156.9 234.2 169.4 246.7C181.9 259.2 202.2 259.2 214.7 246.7L288 173.3L288 480C288 497.7 273.7 512 256 512L160 512z" /></svg>A Collaborative code editor</p>
            </h1>
            <pre className="text-xl outline bg-mist-800 outline-gray-400 p-2 flex items-center">Code Together <svg className='h-7 w-7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M176 168C189.3 168 200 157.3 200 144C200 130.7 189.3 120 176 120C162.7 120 152 130.7 152 144C152 157.3 162.7 168 176 168zM256 144C256 176.8 236.3 205 208 217.3L208 288L384 288C410.5 288 432 266.5 432 240L432 217.3C403.7 205 384 176.8 384 144C384 99.8 419.8 64 464 64C508.2 64 544 99.8 544 144C544 176.8 524.3 205 496 217.3L496 240C496 301.9 445.9 352 384 352L208 352L208 422.7C236.3 435 256 463.2 256 496C256 540.2 220.2 576 176 576C131.8 576 96 540.2 96 496C96 463.2 115.7 435 144 422.7L144 217.4C115.7 205 96 176.8 96 144C96 99.8 131.8 64 176 64C220.2 64 256 99.8 256 144zM488 144C488 130.7 477.3 120 464 120C450.7 120 440 130.7 440 144C440 157.3 450.7 168 464 168C477.3 168 488 157.3 488 144zM176 520C189.3 520 200 509.3 200 496C200 482.7 189.3 472 176 472C162.7 472 152 482.7 152 496C152 509.3 162.7 520 176 520z" /></svg> | Build Faster <svg className='h-7 w-7 inline rotate-180' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M557.7 64.9L363.5 139.6L365.8 110.3C366.8 97.5 353 88.8 341.8 95.2L165.3 197.4C102.6 233.7 64 300.6 64 373C64 485.1 154.9 576 267 576C339.4 576 406.3 537.4 442.6 474.7L544.8 298.3C551.3 287.2 542.6 273.3 529.7 274.3L500.4 276.6L575.1 82.4C575.7 80.9 576 79.2 576 77.6C576 70.1 570 64.1 562.5 64.1C560.8 64.1 559.2 64.4 557.7 65zM256 256C326.7 256 384 313.3 384 384C384 454.7 326.7 512 256 512C185.3 512 128 454.7 128 384C128 313.3 185.3 256 256 256zM256 352C256 334.3 241.7 320 224 320C206.3 320 192 334.3 192 352C192 369.7 206.3 384 224 384C241.7 384 256 369.7 256 352zM272 448C280.8 448 288 440.8 288 432C288 423.2 280.8 416 272 416C263.2 416 256 423.2 256 432C256 440.8 263.2 448 272 448z" /></svg></pre>
            <p className="text-lg text-white">Create a new file to get started !!!</p>
            <div id='command-pallete' className='outline-green-400 p-2 outline'>{shortcuts.map((shortcut, index) => {
                return <pre key={index} className='font-jetbrains-mono text-sm'>{shortcut.name} <svg className='h-5 w-5 inline' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M598.6 342.6C611.1 330.1 611.1 309.8 598.6 297.3L470.6 169.3C458.1 156.8 437.8 156.8 425.3 169.3C412.8 181.8 412.8 202.1 425.3 214.6L498.7 288L64 288C46.3 288 32 302.3 32 320C32 337.7 46.3 352 64 352L498.7 352L425.3 425.4C412.8 437.9 412.8 458.2 425.3 470.7C437.8 483.2 458.1 483.2 470.6 470.7L598.6 342.7z" /></svg> {shortcut.command}</pre>
            })}</div>
        </div>
    )
}

export default EditorFallback
