


N = 5;

pumps = [
[1,5],
[10,3],
[7,5],
[3,4],
[3,6]

]
class Agent:
	def __init__(self):
		self.petrol = 0;
		
	def execute_action(self,start_pump):
		
		for i in range(0 , N):
			curr_pump = (start_pump + i)%N;
			if(i != 0):
				self.petrol -= pumps[(curr_pump -1)%5][1];
				if(self.petrol  <= 0):
					return -1;
			self.petrol += pumps[curr_pump][0];
		return 1;	
	def program(self):
		solns = [];
		for i in range(0 , N):
			result = self.execute_action(i);
			if(result != -1):
				
				return i; 
		
agent = Agent();
result = agent.program();		
print(result);
