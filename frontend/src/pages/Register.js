const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await register(username, email, password);
        alert('Registration successful! Please login.');
        navigate('/login');
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      }
    };
  
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Register
          </button>
        </form>
      </div>
    );
  };
  
  export default Register;