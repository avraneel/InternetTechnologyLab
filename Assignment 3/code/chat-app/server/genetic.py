# Write a program to implement genetic algorithm to find the maximum of a function
# f(x) = x^2 + 2x + 1

import random
import math

# Function to generate random population
def generatePopulation(populationSize, chromosomeLength):
    population = []
    for i in range(populationSize):
        chromosome = []
        for j in range(chromosomeLength):
            chromosome.append(random.randint(0, 1))
        population.append(chromosome)
    return population

# Function to calculate fitness of each chromosome
def calculateFitness(population):
    fitness = []
    for i in range(len(population)):
        chromosome = population[i]
        x = calculateX(chromosome)
        fitness.append(calculateF(x))
    return fitness

# Function to calculate x from chromosome
def calculateX(chromosome):
    x = 0
    for i in range(len(chromosome)):
        x += chromosome[i] * math.pow(2, i)
    return x

# Function to calculate f(x) = x^2 + 2x + 1
def calculateF(x):
    return math.pow(x, 2) + 2 * x + 1

# Function to select parents for crossover
def selectParents(population, fitness):
    parents = []
    for i in range(len(population)):
        r = random.uniform(0, sum(fitness))
        upto = 0
        for j in range(len(population)):
            upto += fitness[j]
            if upto >= r:
                parents.append(population[j])
                break
    return parents

# Function to perform crossover
def crossover(parents, crossoverRate):
    offspring = []
    for i in range(0, len(parents), 2):
        parent1 = parents[i]
        parent2 = parents[i + 1]
        if random.random() < crossoverRate:
            child1 = []
            child2 = []
            crossoverPoint = random.randint(0, len(parent1) - 1)
            for j in range(len(parent1)):
                if j < crossoverPoint:
                    child1.append(parent1[j])
                    child2.append(parent2[j])
                else:
                    child1.append(parent2[j])
                    child2.append(parent1[j])
            offspring.append(child1)
            offspring.append(child2)
        else:
            offspring.append(parent1)
            offspring.append(parent2)
    return offspring

# Function to perform mutation
def mutation(offspring, mutationRate):
    for i in range(len(offspring)):
        if random.random() < mutationRate:
            mutationPoint = random.randint(0, len(offspring[i]) - 1)
            if offspring[i][mutationPoint] == 0:
                offspring[i][mutationPoint] = 1
            else:
                offspring[i][mutationPoint] = 0
    return offspring

# Function to perform elitism
def elitism(population, fitness, elitismCount):
    elites = []
    for i in range(elitismCount):
        maxFitnessIndex = fitness.index(max(fitness))
        elites.append(population[maxFitnessIndex])
        fitness[maxFitnessIndex] = -999999999
    return elites   

# Function to find the maximum of the function
def findMaximum(populationSize, chromosomeLength, crossoverRate, mutationRate, elitismCount, generations):
    population = generatePopulation(populationSize, chromosomeLength)
    for i in range(generations):
        fitness = calculateFitness(population)
        parents = selectParents(population, fitness)
        offspring = crossover(parents, crossoverRate)
        offspring = mutation(offspring, mutationRate)
        elites = elitism(population, fitness, elitismCount)
        population = offspring + elites
    fitness = calculateFitness(population)
    maxFitnessIndex = fitness.index(max(fitness))
    return population[maxFitnessIndex]

# Main function
def main():
    populationSize = 100
    chromosomeLength = 10
    crossoverRate = 0.8
    mutationRate = 0.01
    elitismCount = 20
    generations = 500
    maximum = findMaximum(populationSize, chromosomeLength, crossoverRate, mutationRate, elitismCount, generations)
    print("Maximum of the function is: ", calculateF(calculateX(maximum)))
    
if __name__ == "__main__":
    main()

#Output
#Maximum of the function is:  4.0

# My Personal Notes arrow_drop_up Save


