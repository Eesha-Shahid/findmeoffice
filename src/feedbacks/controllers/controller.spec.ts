import { Test, TestingModule } from "@nestjs/testing";
import { FeedbackService } from "../services/service";
import { FeedbackController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { createFeedbackDto, createdFeedback, mockFeedback, updateFeedbackDto, updatedFeedback } from "../../utlils/feedback.mock";
import { mockUser } from "../../utlils/user.mock";
  
describe('FeedbackController', () => {

    let feedbackService: FeedbackService
    let feedbackController: FeedbackController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FeedbackController],
            providers: [
                {
                    provide: FeedbackService,
                    useValue: {
                        create: jest.fn()
                    }
                }
            ],
        }).compile()

        feedbackService = module.get<FeedbackService>(FeedbackService);
        feedbackController = module.get<FeedbackController>(FeedbackController);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear any calls and reset mock behaviors
    });

    it('should be defined', () => {
        expect(feedbackController).toBeDefined();
    })

    describe('createFeedback', () => {
        it('should create a feedback', async() => {
        
            // Mock the create method to return the created feedback
            feedbackService.create = jest.fn().mockResolvedValue(createdFeedback);          

            // Call the createFeedback method and perform assertions
            const result = await feedbackController.createFeedback(createFeedbackDto, mockUser._id);
            expect(feedbackService.create).toHaveBeenCalledWith(createFeedbackDto);        
            expect(result).toEqual(createdFeedback);
        })
    })
})