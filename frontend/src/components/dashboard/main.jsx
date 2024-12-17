



const Main = ({mainRepos}) => {
    return (
        <main className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-6">Home</h1>
            <div className="space-y-4">
                {mainRepos.map((repo) => (
                    <div key={repo._id} className="bg-[#161b22] border border-gray-700 rounded-lg p-4">
                        <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
                        <p className="text-gray-400 mb-4">{repo.description}</p>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                            VIEW REPOSITORY
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Main;